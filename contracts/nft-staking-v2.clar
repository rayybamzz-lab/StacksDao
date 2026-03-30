;; ============================================================
;; StacksDAO NFT Staking Contract
;; ============================================================
;; Stake your StacksDAO NFTs to earn SDAO governance tokens.
;; Rewards accrue per block. Claim anytime or on unstake.
;; ============================================================

;; ---------------------
;; Constants
;; ---------------------

;; @const CONTRACT-OWNER
;; Immutable protocol setting
(define-constant CONTRACT-OWNER tx-sender)

;; @const REWARD-PER-BLOCK
;; Immutable protocol setting
(define-constant REWARD-PER-BLOCK u10000000)       ;; 10 SDAO per block (with 6 decimals)

;; @const ERR-NOT-AUTHORIZED
;; Immutable protocol setting
(define-constant ERR-NOT-AUTHORIZED (err u401))

;; @const ERR-NOT-STAKED
;; Immutable protocol setting
(define-constant ERR-NOT-STAKED (err u601))

;; @const ERR-ALREADY-STAKED
;; Immutable protocol setting
(define-constant ERR-ALREADY-STAKED (err u602))

;; @const ERR-NOT-OWNER
;; Immutable protocol setting
(define-constant ERR-NOT-OWNER (err u603))

;; @const ERR-NO-REWARDS
;; Immutable protocol setting
(define-constant ERR-NO-REWARDS (err u604))

;; ---------------------
;; Data Maps
;; ---------------------

;; Track each staked NFT: who staked it and when
(define-map staking-data uint
  {
    staker: principal,
    staked-at-block: uint,
    last-claim-block: uint
  }
)

;; Track how many NFTs each user has staked
(define-map staker-balance principal uint)

;; Total NFTs currently staked

;; @var total-staked
;; Protocol state tracking for total staked
(define-data-var total-staked uint u0)

;; ---------------------
;; Stake NFT
;; ---------------------

;; @desc stake-nft
;; State-modifying public function
(define-public (stake-nft (token-id uint))
  (let
    (
      (owner (unwrap! (contract-call? .stacks-nft-v2 get-owner token-id) ERR-NOT-AUTHORIZED))
    )
    ;; Verify caller owns the NFT
    (asserts! (is-eq (some tx-sender) owner) ERR-NOT-OWNER)
    ;; Verify NFT is not already staked
    (asserts! (is-none (map-get? staking-data token-id)) ERR-ALREADY-STAKED)

    ;; Transfer NFT to this contract for custody
    (try! (contract-call? .stacks-nft-v2 transfer token-id tx-sender (as-contract tx-sender)))

    ;; Record staking data
    (map-set staking-data token-id {
      staker: tx-sender,
      staked-at-block: block-height,
      last-claim-block: block-height
    })

    ;; Update balances
    (map-set staker-balance tx-sender
      (+ (default-to u0 (map-get? staker-balance tx-sender)) u1)
    )
    (var-set total-staked (+ (var-get total-staked) u1))

    (print { event: "nft-staked", token-id: token-id, staker: tx-sender, block: block-height })
    (ok true)
  )
)

;; ---------------------
;; Unstake NFT
;; ---------------------

;; @desc unstake-nft
;; State-modifying public function
(define-public (unstake-nft (token-id uint))
  (let
    (
      (stake-info (unwrap! (map-get? staking-data token-id) ERR-NOT-STAKED))
      (staker (get staker stake-info))
      (last-claim (get last-claim-block stake-info))
      (blocks-staked (- block-height last-claim))
      (rewards (* blocks-staked REWARD-PER-BLOCK))
    )
    ;; Only the original staker can unstake
    (asserts! (is-eq tx-sender staker) ERR-NOT-OWNER)

    ;; Mint any pending rewards
    (if (> rewards u0)
      (try! (contract-call? .governance-token-v2 mint rewards tx-sender))
      true
    )

    ;; Return NFT to staker
    (try! (as-contract (contract-call? .stacks-nft-v2 transfer token-id tx-sender staker)))

    ;; Clean up staking data
    (map-delete staking-data token-id)

    ;; Update balances
    (map-set staker-balance tx-sender
      (- (default-to u0 (map-get? staker-balance tx-sender)) u1)
    )
    (var-set total-staked (- (var-get total-staked) u1))

    (print { event: "nft-unstaked", token-id: token-id, staker: tx-sender, rewards: rewards })
    (ok rewards)
  )
)

;; ---------------------
;; Claim Rewards (without unstaking)
;; ---------------------

;; @desc claim-rewards
;; State-modifying public function
(define-public (claim-rewards (token-id uint))
  (let
    (
      (stake-info (unwrap! (map-get? staking-data token-id) ERR-NOT-STAKED))
      (staker (get staker stake-info))
      (last-claim (get last-claim-block stake-info))
      (blocks-staked (- block-height last-claim))
      (rewards (* blocks-staked REWARD-PER-BLOCK))
    )
    ;; Only the staker can claim
    (asserts! (is-eq tx-sender staker) ERR-NOT-OWNER)
    ;; Must have rewards to claim
    (asserts! (> rewards u0) ERR-NO-REWARDS)

    ;; Mint rewards
    (try! (contract-call? .governance-token-v2 mint rewards tx-sender))

    ;; Update last claim block
    (map-set staking-data token-id
      (merge stake-info { last-claim-block: block-height })
    )

    (print { event: "rewards-claimed", token-id: token-id, staker: tx-sender, rewards: rewards })
    (ok rewards)
  )
)

;; ---------------------
;; Read-Only Functions
;; ---------------------


;; @desc get-staking-info
;; Read-only context viewer
(define-read-only (get-staking-info (token-id uint))
  (map-get? staking-data token-id)
)


;; @desc get-pending-rewards
;; Read-only context viewer
(define-read-only (get-pending-rewards (token-id uint))
  (match (map-get? staking-data token-id)
    stake-info
      (let
        (
          (last-claim (get last-claim-block stake-info))
          (blocks-staked (- block-height last-claim))
        )
        (ok (* blocks-staked REWARD-PER-BLOCK))
      )
    (err u0)
  )
)


;; @desc get-staker-balance
;; Read-only context viewer
(define-read-only (get-staker-balance (staker principal))
  (default-to u0 (map-get? staker-balance staker))
)

(define-read-only (get-total-staked)
  (ok (var-get total-staked))
)

(define-read-only (get-reward-per-block)
  (ok REWARD-PER-BLOCK)
)
