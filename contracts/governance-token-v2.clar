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
;; ---------------------
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
;; State-modifying public function
(define-public (set-authorized-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ok (var-set authorized-minter (some minter)))
  )
)

;; Mint tokens - restricted to deployer or staking contract

;; @desc mint
;; State-modifying public function
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-authorized-minter) ERR-NOT-AUTHORIZED)
    (ft-mint? sdao-token amount recipient)
  )
)

;; Burn tokens

;; @desc burn
;; State-modifying public function
(define-public (burn (amount uint) (sender principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (ft-burn? sdao-token amount sender)
  )
)

;; ---------------------
;; SIP-010 Interface
;; ---------------------


;; @desc transfer
;; State-modifying public function
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (try! (ft-transfer? sdao-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name)
  (ok "StacksDAO Token")
)

(define-read-only (get-symbol)
  (ok "SDAO")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance sdao-token account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply sdao-token))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)
