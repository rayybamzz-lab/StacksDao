;; ============================================================
;; StacksDAO NFT - SIP-009 Non-Fungible Token
;; ============================================================
;; Mint cost: 0.01 STX (u10000 micro-STX)
;; Max supply: 10,000 NFTs
;; Sequential token IDs starting from 1
;; ============================================================

;; ---------------------
;; SIP-009 Trait
;; ---------------------
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; ---------------------
;; NFT Definition
;; ---------------------
(define-non-fungible-token stacksdao-nft uint)

;; ---------------------
;; Constants
;; ---------------------

;; @const CONTRACT-OWNER
;; Immutable protocol setting
(define-constant CONTRACT-OWNER tx-sender)

;; @const MINT-PRICE
;; Immutable protocol setting
(define-constant MINT-PRICE u10000)             ;; 0.01 STX in micro-STX

;; @const MAX-SUPPLY
;; Immutable protocol setting
(define-constant MAX-SUPPLY u10000)

;; @const ERR-NOT-AUTHORIZED
;; Immutable protocol setting
(define-constant ERR-NOT-AUTHORIZED (err u401))

;; @const ERR-SOLD-OUT
;; Immutable protocol setting
(define-constant ERR-SOLD-OUT (err u501))

;; @const ERR-INSUFFICIENT-PAYMENT
;; Immutable protocol setting
(define-constant ERR-INSUFFICIENT-PAYMENT (err u502))

;; @const ERR-NOT-FOUND
;; Immutable protocol setting
(define-constant ERR-NOT-FOUND (err u504))

;; @const ERR-ALREADY-LISTED
;; Immutable protocol setting
(define-constant ERR-ALREADY-LISTED (err u505))

;; @const ERR-NOT-OWNER
;; Immutable protocol setting
(define-constant ERR-NOT-OWNER (err u506))

;; ---------------------
;; Data Variables
;; ---------------------

;; @var last-token-id
;; Protocol state tracking for last token id
(define-data-var last-token-id uint u0)
(define-data-var base-uri (string-ascii 256) "https://stacksdao.io/nft/metadata/")

;; @var paused
;; Protocol state tracking for paused
(define-data-var paused bool false)

;; ---------------------
;; Data Maps
;; ---------------------

;; ---------------------
;; Mint Function
;; ---------------------

;; @desc mint
;; @returns (response uint uint) - Returns the newly minted token ID
;; State-modifying public function
(define-public (mint)
  (let
    (
      (next-id (+ (var-get last-token-id) u1))
    )
    ;; Check not paused
    (asserts! (not (var-get paused)) ERR-NOT-AUTHORIZED)
    ;; Check supply cap
    (asserts! (<= next-id MAX-SUPPLY) ERR-SOLD-OUT)
    ;; Transfer mint price to contract owner
    (try! (stx-transfer? MINT-PRICE tx-sender CONTRACT-OWNER))
    ;; Mint the NFT
    (try! (nft-mint? stacksdao-nft next-id tx-sender))
    ;; Update counter
    (var-set last-token-id next-id)
    (ok next-id)
  )
)

;; Batch mint (up to 5 per call)

;; @desc mint-batch
;; @param count uint - The number of NFTs to mint (max 5)
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (mint-batch (count uint))
  (begin
    (asserts! (<= count u5) (err u503))
    ;; Using internal unwrapping for batch mints
    (if (>= count u1) (unwrap-panic (mint)) u0)
    (if (>= count u2) (unwrap-panic (mint)) u0)
    (if (>= count u3) (unwrap-panic (mint)) u0)
    (if (>= count u4) (unwrap-panic (mint)) u0)
    (if (>= count u5) (unwrap-panic (mint)) u0)
    (ok true)
  )
)

;; --------------------------------------------------------------------------
;; URI Management
;; --------------------------------------------------------------------------
;; @desc get-base-uri
;; Read-only context viewer
(define-read-only (get-base-uri)
  (ok (var-get base-uri))
)

;; @desc set-base-uri
;; @param new-base-uri (string-ascii 256) - The new base URI
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (set-base-uri (new-base-uri (string-ascii 256)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    ;; Prevents setting an empty or oversized URI
    (asserts! (> (len new-base-uri) u0) ERR-NOT-AUTHORIZED)
    (var-set base-uri new-base-uri)
    (ok true)
  )
)

;; --------------------------------------------------------------------------
;; Supply Management
;; --------------------------------------------------------------------------

;; @desc set-paused
;; @param new-paused bool - True to pause minting
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (set-paused (new-paused bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ok (var-set paused new-paused))
  )
)

;; @desc get-paused
;; @returns (response bool none) - Returns whether minting is paused
;; Read-only context viewer
(define-read-only (get-paused)
  (ok (var-get paused))
)

;; ---------------------
;; SIP-009 Interface
;; ---------------------

;; @desc transfer
;; @param token-id uint - The ID of the NFT to transfer
;; @param sender principal - The address currently owning the NFT
;; @param recipient principal - The address to receive the NFT
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (not (is-eq recipient sender)) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (some sender) (nft-get-owner? stacksdao-nft token-id)) ERR-NOT-OWNER)
    (nft-transfer? stacksdao-nft token-id sender recipient)
  )
)

;; @desc get-owner
;; @param token-id uint - The ID of the NFT to query
;; @returns (response (optional principal) uint) - Returns the owner address
;; Read-only context viewer
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? stacksdao-nft token-id))
)

;; @desc get-last-token-id
;; @returns (response uint none) - Returns the count of minted NFTs
;; Read-only context viewer
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

;; @desc get-contract-owner
;; @returns (response principal none) - Returns the NFT contract owner
;; Read-only context viewer
(define-read-only (get-contract-owner)
  (ok CONTRACT-OWNER)
)

;; @desc get-token-uri
;; @param token-id uint - The ID of the NFT to query
;; @returns (response (optional (string-ascii 256)) uint) - Returns the token metadata URI
;; Read-only context viewer
(define-read-only (get-token-uri (token-id uint))
  (match (nft-get-owner? stacksdao-nft token-id)
    owner (ok (some (var-get base-uri)))
    (ok none)
  )
)

;; ---------------------
;; Read-Only Helpers
;; ---------------------

;; @desc get-mint-price
;; @returns (response uint none) - Returns the current mint price in micro-STX
;; Read-only context viewer
(define-read-only (get-mint-price)
  (ok MINT-PRICE)
)

;; @desc get-max-supply
;; @returns (response uint none) - Returns the maximum allowed supply
;; Read-only context viewer
(define-read-only (get-max-supply)
  (ok MAX-SUPPLY)
)

;; @desc get-remaining-supply
;; @returns (response uint none) - Returns the number of NFTs remaining to be minted
;; Read-only context viewer
(define-read-only (get-remaining-supply)
  (ok (- MAX-SUPPLY (var-get last-token-id)))
)

;; @desc get-token-count
;; @returns uint
;; Read-only context viewer
(define-read-only (get-token-count)
  (var-get last-token-id)
)

;; @desc exists
;; @param token-id uint
;; @returns (response bool uint)
;; Read-only context viewer
(define-read-only (exists (token-id uint))
  (ok (is-some (nft-get-owner? stacksdao-nft token-id)))
)

;; @desc get-all-token-ids
;; @returns (response (list 10000 uint) uint)
;; Read-only context viewer
(define-read-only (get-all-token-ids)
  (ok (list))
)

;; @desc is-owner
;; @param token-id uint
;; @param owner principal
;; @returns (response bool uint)
;; Read-only context viewer
(define-read-only (is-owner (token-id uint) (owner principal))
  (ok (is-eq (some owner) (nft-get-owner? stacksdao-nft token-id)))
)

;; @desc get-batch-mint-price
;; @param count uint
;; @returns (response uint uint)
;; Read-only context viewer
(define-read-only (get-batch-mint-price (count uint))
  (ok (* count MINT-PRICE))
)

;; @desc get-contract-metadata
;; @returns (response (tuple (name (string-ascii 32)) (symbol (string-ascii 10)) (base-uri (string-ascii 256))) uint)
;; Read-only context viewer
(define-read-only (get-contract-metadata)
  (ok { name: "StacksDAO NFT", symbol: "SDAO-NFT", base-uri: (var-get base-uri) })
)

;; @desc get-mint-status
;; @returns (response (tuple (paused bool) (remaining uint)) uint)
;; Read-only context viewer
(define-read-only (get-mint-status)
  (ok { paused: (var-get paused), remaining: (- MAX-SUPPLY (var-get last-token-id)) })
)

;; @desc get-token-info
;; @param token-id uint
;; @returns (response (tuple (owner (optional principal)) (uri (optional (string-ascii 256)))) uint)
;; Read-only context viewer
(define-read-only (get-token-info (token-id uint))
  (ok { owner: (nft-get-owner? stacksdao-nft token-id), uri: (some (var-get base-uri)) })
)

;; @desc is-mint-paused
;; @returns (response bool uint)
;; Read-only context viewer
(define-read-only (is-mint-paused)
  (ok (var-get paused))
)

;; @desc get-available-supply
;; @returns (response uint uint)
;; Read-only context viewer
(define-read-only (get-available-supply)
  (ok (- MAX-SUPPLY (var-get last-token-id)))
)

;; @desc get-token-creator
;; @param token-id uint
;; @returns (response principal uint)
;; Read-only context viewer
(define-read-only (get-token-creator (token-id uint))
  (ok CONTRACT-OWNER)
)

;; @desc get-token-royalty
;; @param token-id uint
;; @returns (response uint uint)
;; Read-only context viewer
(define-read-only (get-token-royalty (token-id uint))
  (ok u0)
)
