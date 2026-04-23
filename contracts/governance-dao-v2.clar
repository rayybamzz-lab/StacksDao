;; ============================================================
;; StacksDAO Governance Contract
;; ============================================================
;; On-chain DAO governance powered by SDAO tokens.
;; Token holders can create proposals, vote, and execute
;; approved proposals after the voting window closes.
;; ============================================================

;; ---------------------
;; Constants
;; ---------------------

;; @const CONTRACT-OWNER
;; Immutable protocol setting
(define-constant CONTRACT-OWNER tx-sender)

;; @const VOTING-PERIOD
;; Immutable protocol setting
(define-constant VOTING-PERIOD u144)                ;; ~1 day (144 blocks x 10 min)

;; @const MIN-PROPOSAL-BALANCE
;; Immutable protocol setting
(define-constant MIN-PROPOSAL-BALANCE u100000000)   ;; 100 SDAO (with 6 decimals) to create proposal

;; @const QUORUM
;; Immutable protocol setting
(define-constant QUORUM u500000000)                 ;; 500 SDAO minimum total votes for quorum

;; @const ERR-NOT-AUTHORIZED
;; Immutable protocol setting
(define-constant ERR-NOT-AUTHORIZED (err u401))

;; @const ERR-PROPOSAL-NOT-FOUND
;; Immutable protocol setting
(define-constant ERR-PROPOSAL-NOT-FOUND (err u701))

;; @const ERR-ALREADY-VOTED
;; Immutable protocol setting
(define-constant ERR-ALREADY-VOTED (err u702))

;; @const ERR-VOTING-ENDED
;; Immutable protocol setting
(define-constant ERR-VOTING-ENDED (err u703))

;; @const ERR-VOTING-ACTIVE
;; Immutable protocol setting
(define-constant ERR-VOTING-ACTIVE (err u704))

;; @const ERR-QUORUM-NOT-MET
;; Immutable protocol setting
(define-constant ERR-QUORUM-NOT-MET (err u705))

;; @const ERR-PROPOSAL-REJECTED
;; Immutable protocol setting
(define-constant ERR-PROPOSAL-REJECTED (err u706))

;; @const ERR-ALREADY-EXECUTED
;; Immutable protocol setting
(define-constant ERR-ALREADY-EXECUTED (err u707))

;; @const ERR-INSUFFICIENT-BALANCE
;; Immutable protocol setting
(define-constant ERR-INSUFFICIENT-BALANCE (err u708))

;; @const ERR-VOTING-NOT-ENDED
;; Immutable protocol setting
(define-constant ERR-VOTING-NOT-ENDED (err u709))

;; @const ERR-INVALID-TITLE
;; Immutable protocol setting
(define-constant ERR-INVALID-TITLE (err u710))

;; @const ERR-INVALID-DESCRIPTION
;; Immutable protocol setting
(define-constant ERR-INVALID-DESCRIPTION (err u711))

;; ---------------------
;; Data Variables
;; ---------------------

;; @var proposal-count
;; Protocol state tracking for proposal count
(define-data-var proposal-count uint u0)

;; ---------------------
;; Data Maps
;; ---------------------

;; Proposal storage
(define-map proposals uint
  {
    title: (string-utf8 256),
    description: (string-utf8 1024),
    proposer: principal,
    start-block: uint,
    end-block: uint,
    votes-for: uint,
    votes-against: uint,
    executed: bool,
    total-votes: uint
  }
)

;; Track votes per user per proposal
(define-map votes { proposal-id: uint, voter: principal }
  {
    amount: uint,
    in-favor: bool
  }
)

;; ---------------------
;; Create Proposal
;; ---------------------

;; @desc create-proposal
;; @param title (string-utf8 256) - The title of the proposal
;; @param description (string-utf8 1024) - Detailed description of the proposal
;; @returns (response uint uint) - Returns the new proposal ID
;; State-modifying public function
(define-public (create-proposal
    (title (string-utf8 256))
    (description (string-utf8 1024))
  )
  (let
    (
      (proposer-balance (unwrap-panic (contract-call? .governance-token-v2 get-balance tx-sender)))
      (new-id (+ (var-get proposal-count) u1))
    )
    ;; Validate title
    (asserts! (> (len title) u0) ERR-INVALID-TITLE)
    ;; Validate description
    (asserts! (> (len description) u0) ERR-INVALID-DESCRIPTION)
    ;; Validate proposer balance threshold
    (asserts! (>= proposer-balance MIN-PROPOSAL-BALANCE) ERR-INSUFFICIENT-BALANCE)

    ;; Create the proposal
    (map-set proposals new-id {
      title: title,
      description: description,
      proposer: tx-sender,
      start-block: block-height,
      end-block: (+ block-height VOTING-PERIOD),
      votes-for: u0,
      votes-against: u0,
      executed: false,
      total-votes: u0
    })

    (var-set proposal-count new-id)

    (print { event: "proposal-created", id: new-id, proposer: tx-sender, title: title })
    (ok new-id)
  )
)

;; ---------------------
;; Vote For
;; ---------------------

;; @desc vote-for
;; @param proposal-id uint - The ID of the proposal to vote in favor of
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (vote-for (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals proposal-id) ERR-PROPOSAL-NOT-FOUND))
      (voter-balance (unwrap-panic (contract-call? .governance-token-v2 get-balance tx-sender)))
    )
    ;; Voting must be active
    (asserts! (<= block-height (get end-block proposal)) ERR-VOTING-ENDED)
    ;; Cannot vote twice
    (asserts! (is-none (map-get? votes { proposal-id: proposal-id, voter: tx-sender })) ERR-ALREADY-VOTED)
    ;; Must hold tokens
    (asserts! (> voter-balance u0) ERR-INSUFFICIENT-BALANCE)

    ;; Record vote
    (map-set votes { proposal-id: proposal-id, voter: tx-sender }
      { amount: voter-balance, in-favor: true }
    )

    ;; Update proposal tallies
    (map-set proposals proposal-id
      (merge proposal {
        votes-for: (+ (get votes-for proposal) voter-balance),
        total-votes: (+ (get total-votes proposal) voter-balance)
      })
    )

    (print { event: "vote-cast", proposal-id: proposal-id, voter: tx-sender, in-favor: true, weight: voter-balance })
    (ok true)
  )
)

;; ---------------------
;; Vote Against
;; ---------------------

;; @desc vote-against
;; @param proposal-id uint - The ID of the proposal to vote against
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (vote-against (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals proposal-id) ERR-PROPOSAL-NOT-FOUND))
      (voter-balance (unwrap-panic (contract-call? .governance-token-v2 get-balance tx-sender)))
    )
    ;; Voting must be active
    (asserts! (<= block-height (get end-block proposal)) ERR-VOTING-ENDED)
    ;; Cannot vote twice
    (asserts! (is-none (map-get? votes { proposal-id: proposal-id, voter: tx-sender })) ERR-ALREADY-VOTED)
    ;; Must hold tokens
    (asserts! (> voter-balance u0) ERR-INSUFFICIENT-BALANCE)

    ;; Record vote
    (map-set votes { proposal-id: proposal-id, voter: tx-sender }
      { amount: voter-balance, in-favor: false }
    )

    ;; Update proposal tallies
    (map-set proposals proposal-id
      (merge proposal {
        votes-against: (+ (get votes-against proposal) voter-balance),
        total-votes: (+ (get total-votes proposal) voter-balance)
      })
    )

    (print { event: "vote-cast", proposal-id: proposal-id, voter: tx-sender, in-favor: false, weight: voter-balance })
    (ok true)
  )
)

;; ---------------------
;; Execute Proposal
;; ---------------------

;; @desc execute-proposal
;; @param proposal-id uint - The ID of the proposal to execute
;; @returns (response bool uint) - Returns true on success
;; State-modifying public function
(define-public (execute-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals proposal-id) ERR-PROPOSAL-NOT-FOUND))
    )
    ;; Voting period must be over
    (asserts! (> block-height (get end-block proposal)) ERR-VOTING-NOT-ENDED)
    ;; Cannot execute twice
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    ;; Quorum must be met
    (asserts! (>= (get total-votes proposal) QUORUM) ERR-QUORUM-NOT-MET)
    ;; Must have more votes for than against
    (asserts! (> (get votes-for proposal) (get votes-against proposal)) ERR-PROPOSAL-REJECTED)

    ;; Mark as executed
    (map-set proposals proposal-id
      (merge proposal { executed: true })
    )

    (print { event: "proposal-executed", proposal-id: proposal-id })
    (ok true)
  )
)

;; @desc get-contract-owner
;; Read-only context viewer
(define-read-only (get-contract-owner)
  (ok CONTRACT-OWNER)
)

;; ---------------------
;; Read-Only Functions
;; ---------------------

;; @desc get-proposal
;; @param proposal-id uint - The ID of the proposal to query
;; @returns (optional (tuple (title (string-utf8 256)) (description (string-utf8 1024)) (proposer principal) (start-block uint) (end-block uint) (votes-for uint) (votes-against uint) (executed bool) (total-votes uint)))
;; Read-only context viewer
(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals proposal-id)
)

;; @desc get-proposal-count
;; @returns (response uint none) - Returns the total number of proposals created
;; Read-only context viewer
(define-read-only (get-proposal-count)
  (ok (var-get proposal-count))
)

;; @desc get-vote
;; @param proposal-id uint - The ID of the proposal
;; @param voter principal - The address of the voter
;; @returns (optional (tuple (amount uint) (in-favor bool))) - Returns the vote record or none
;; Read-only context viewer
(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)

;; @desc is-voting-active
;; @param proposal-id uint - The ID of the proposal
;; @returns (response bool uint) - Returns true if the voting period has not ended
;; Read-only context viewer
(define-read-only (is-voting-active (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (ok (<= block-height (get end-block proposal)))
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; @desc get-voting-period
;; @returns (response uint none) - Returns the voting duration in blocks
;; Read-only context viewer
(define-read-only (get-voting-period)
  (ok VOTING-PERIOD)
)

;; @desc get-min-proposal-balance
;; @returns (response uint none) - Returns the minimum SDAO required to create a proposal
;; Read-only context viewer
(define-read-only (get-min-proposal-balance)
  (ok MIN-PROPOSAL-BALANCE)
)

;; @desc get-quorum
;; @returns (response uint none) - Returns the minimum total votes required for quorum
;; Read-only context viewer
(define-read-only (get-quorum)
  (ok QUORUM)
)

;; @desc get-proposal-tally
;; @param proposal-id uint
;; @returns (response (tuple (votes-for uint) (votes-against uint) (total uint)) uint)
;; Read-only context viewer
(define-read-only (get-proposal-tally (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (ok { votes-for: (get votes-for proposal), votes-against: (get votes-against proposal), total: (get total-votes proposal) })
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; @desc get-proposal-proposer
;; @param proposal-id uint
;; @returns (response principal uint)
;; Read-only context viewer
(define-read-only (get-proposal-proposer (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (ok (get proposer proposal))
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; @desc get-proposal-status
;; @param proposal-id uint
;; @returns (response (string-ascii 10) uint)
;; Read-only context viewer
(define-read-only (get-proposal-status (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal
      (ok
        (if (get executed proposal)
          "executed"
          (if (> block-height (get end-block proposal))
            (if (> (get votes-for proposal) (get votes-against proposal))
              "passed"
              "rejected"
            )
            "active"
          )
        )
      )
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; @desc get-proposal-title
;; @param proposal-id uint
;; @returns (response (string-utf8 256) uint)
;; Read-only context viewer
(define-read-only (get-proposal-title (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (ok (get title proposal))
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; @desc get-proposal-description
;; @param proposal-id uint
;; @returns (response (string-utf8 1024) uint)
;; Read-only context viewer
(define-read-only (get-proposal-description (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (ok (get description proposal))
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; @desc get-proposal-end-block
;; @param proposal-id uint
;; @returns (response uint uint)
;; Read-only context viewer
(define-read-only (get-proposal-end-block (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (ok (get end-block proposal))
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; @desc has-voted
;; @param proposal-id uint
;; @param voter principal
;; @returns (response bool uint)
;; Read-only context viewer
(define-read-only (has-voted (proposal-id uint) (voter principal))
  (ok (is-some (map-get? votes { proposal-id: proposal-id, voter: voter })))
)

;; @desc get-total-proposals
;; @returns uint
;; Read-only context viewer
(define-read-only (get-total-proposals)
  (var-get proposal-count)
)

;; @desc get-remaining-voting-blocks
;; @param proposal-id uint
;; @returns (response int uint)
;; Read-only context viewer
(define-read-only (get-remaining-voting-blocks (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (ok (to-int (- (get end-block proposal) block-height)))
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; @desc get-proposal-start-block
;; @param proposal-id uint
;; @returns (response uint uint)
;; Read-only context viewer
(define-read-only (get-proposal-start-block (proposal-id uint))
  (match (map-get? proposals proposal-id)
    proposal (ok (get start-block proposal))
    ERR-PROPOSAL-NOT-FOUND
  )
)
