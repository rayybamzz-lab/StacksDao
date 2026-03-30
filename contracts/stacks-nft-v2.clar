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
(define-map token-uris uint (string-ascii 256))

;; ---------------------
;; Mint Function
;; ---------------------

;; @desc mint
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

;; ---------------------
;; Admin Functions
;; ---------------------


;; @desc set-base-uri
;; State-modifying public function
(define-public (set-base-uri (new-uri (string-ascii 256)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ok (var-set base-uri new-uri))
  )
)


;; @desc set-paused
;; State-modifying public function
(define-public (set-paused (new-paused bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (ok (var-set paused new-paused))
  )
)

;; ---------------------
;; SIP-009 Interface
;; ---------------------


;; @desc transfer
;; State-modifying public function
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (some sender) (nft-get-owner? stacksdao-nft token-id)) ERR-NOT-OWNER)
    (nft-transfer? stacksdao-nft token-id sender recipient)
  )
)


;; @desc get-owner
;; Read-only context viewer
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? stacksdao-nft token-id))
)


;; @desc get-last-token-id
;; Read-only context viewer
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)


;; @desc get-token-uri
;; Read-only context viewer
(define-read-only (get-token-uri (token-id uint))
  (ok (some (var-get base-uri)))
)

;; ---------------------
;; Read-Only Helpers
;; ---------------------


;; @desc get-mint-price
;; Read-only context viewer
(define-read-only (get-mint-price)
  (ok MINT-PRICE)
)


;; @desc get-max-supply
;; Read-only context viewer
(define-read-only (get-max-supply)
  (ok MAX-SUPPLY)
)

(define-read-only (get-remaining-supply)
  (ok (- MAX-SUPPLY (var-get last-token-id)))
)
