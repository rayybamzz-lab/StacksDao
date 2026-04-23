;; ============================================================
;; StacksDAO Governance Token (SDAO) - SIP-010 Fungible Token
;; ============================================================
;; The protocol reward & governance token.
;; Only the staking contract or deployer can mint new tokens.
;; ============================================================

;; ---------------------
;; SIP-010 Trait
;; ---------------------
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; ---------------------
;; Token Definition
;; ---------------------
(define-fungible-token sdao-token)

;; ---------------------
;; Constants
;; ---------------------

;; @const CONTRACT-OWNER
;; Immutable protocol setting
(define-constant CONTRACT-OWNER tx-sender)

;; @const ERR-NOT-AUTHORIZED
;; Immutable protocol setting
(define-constant ERR-NOT-AUTHORIZED (err u401))

;; @const ERR-INSUFFICIENT-BALANCE
;; Immutable protocol setting
(define-constant ERR-INSUFFICIENT-BALANCE (err u402))

;; ---------------------
;; Data Variables
;; ---------------------
(define-data-var token-uri (optional (string-utf8 256)) (some u"https://stacksdao.io/token/sdao.json"))
(define-data-var authorized-minter (optional principal) none)

;; ---------------------
;; Authorization Helpers
;; @desc is-authorized-minter
;; @returns bool - True if sender is the deployer or an authorized contract
(define-private (is-authorized-minter)
  (or 
    (is-eq tx-sender CONTRACT-OWNER) 
    (is-eq (some tx-sender) (var-get authorized-minter))
  )
)

;; ---------------------
;; Admin Functions
;; ---------------------

;; Set the staking contract as authorized minter

;; @desc set-authorized-minter
;; @param minter principal - The address of the staking/admin contract
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (set-authorized-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set authorized-minter (some minter))
    (print { event: "authorized-minter-updated", minter: minter })
    (ok true)
  )
)

;; Mint tokens - restricted to deployer or staking contract

;; @desc mint
;; @param amount uint - The number of tokens to mint
;; @param recipient principal - The address receiving the tokens
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-authorized-minter) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INSUFFICIENT-BALANCE)
    (ft-mint? sdao-token amount recipient)
  )
)

;; Burn tokens

;; @desc burn
;; @param amount uint - The number of tokens to burn
;; @param sender principal - The address owning the tokens
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (burn (amount uint) (sender principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INSUFFICIENT-BALANCE)
    (ft-burn? sdao-token amount sender)
  )
)

;; ---------------------
;; SIP-010 Interface
;; ---------------------

;; @desc transfer
;; @param amount uint - The number of tokens to transfer
;; @param sender principal - The address sending the tokens
;; @param recipient principal - The address receiving the tokens
;; @param memo (optional (buff 34)) - Optional memo for the transfer
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (> amount u0) ERR-INSUFFICIENT-BALANCE)
    (try! (ft-transfer? sdao-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

;; @desc get-name
;; @returns (response (string-ascii 32) none) - Returns "StacksDAO Token"
;; Read-only context viewer
(define-read-only (get-name)
  (ok "StacksDAO Token")
)

;; @desc get-symbol
;; @returns (response (string-ascii 10) none) - Returns "SDAO"
;; Read-only context viewer
(define-read-only (get-symbol)
  (ok "SDAO")
)

;; @desc get-decimals
;; @returns (response uint none) - Returns u6 (standard fungible token decimals)
;; Read-only context viewer
(define-read-only (get-decimals)
  (ok u6)
)

;; @desc get-balance
;; @param account principal - The address to query
;; @returns (response uint none) - Returns the token balance
;; Read-only context viewer
(define-read-only (get-balance (account principal))
  (ok (ft-get-balance sdao-token account))
)

;; @desc get-total-supply
;; @returns (response uint none) - Returns the total token supply
;; Read-only context viewer
(define-read-only (get-total-supply)
  (ok (ft-get-supply sdao-token))
)

;; @desc get-token-uri
;; @returns (response (optional (string-utf8 256)) none) - Returns the token metadata URI
;; Read-only context viewer
(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; @desc get-authorized-minter
;; @returns (response (optional principal) none) - Returns the current authorized minter principal
;; Read-only context viewer
(define-read-only (get-authorized-minter)
  (ok (var-get authorized-minter))
)

;; @desc get-contract-owner
;; @returns (response principal none)
;; Read-only context viewer
(define-read-only (get-contract-owner)
  (ok CONTRACT-OWNER)
)

;; @desc is-minter
;; @param addr principal
;; @returns (response bool uint)
;; Read-only context viewer
(define-read-only (is-minter (addr principal))
  (ok (or (is-eq addr CONTRACT-OWNER) (is-eq (some addr) (var-get authorized-minter))))
)

;; @desc get-minter-or-owner
;; @returns (response principal uint)
;; Read-only context viewer
(define-read-only (get-minter-or-owner)
  (ok (default-to CONTRACT-OWNER (var-get authorized-minter)))
)

;; @desc has-authorized-minter
;; @returns (response bool none)
;; Read-only context viewer
(define-read-only (has-authorized-minter)
  (ok (is-some (var-get authorized-minter)))
)

;; @desc get-token-summary
;; @returns (response (tuple (name (string-ascii 32)) (symbol (string-ascii 10)) (decimals uint) (supply uint)) none)
;; Read-only context viewer
(define-read-only (get-token-summary)
  (ok { name: "StacksDAO Token", symbol: "SDAO", decimals: u6, supply: (ft-get-supply sdao-token) })
)

;; @desc can-mint
;; @param addr principal
;; @returns (response bool uint)
;; Read-only context viewer
(define-read-only (can-mint (addr principal))
  (ok (or (is-eq addr CONTRACT-OWNER) (is-eq (some addr) (var-get authorized-minter))))
)

;; @desc can-burn
;; @param addr principal
;; @returns (response bool uint)
;; Read-only context viewer
(define-read-only (can-burn (addr principal))
  (ok true)
)

;; @desc get-balance-or-zero
;; @param account principal
;; @returns uint
;; Read-only context viewer
(define-read-only (get-balance-or-zero (account principal))
  (ft-get-balance sdao-token account)
)

;; @desc is-sip010-compliant
;; @returns (response bool none)
;; Read-only context viewer
(define-read-only (is-sip010-compliant)
  (ok true)
)

;; @desc get-allowance
;; @param owner principal
;; @param spender principal
;; @returns (response uint none)
;; Read-only context viewer
(define-read-only (get-allowance (owner principal) (spender principal))
  (ok u0)
)

;; @desc get-circulating-supply
;; @returns (response uint none)
;; Read-only context viewer
(define-read-only (get-circulating-supply)
  (ok (ft-get-supply sdao-token))
)
