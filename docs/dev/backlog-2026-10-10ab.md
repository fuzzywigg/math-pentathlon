# Engineering backlog — 2026-10-10ab (tip refill after post1059 mid-fold / round-28)

**Task id:** `q-mp-090ab`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1059` @ `17063bd6` (full `17063bd60068c804214efd35c6c84ce28f1eeecf`)  
**Depends on:** tip cut after `q-mp-026r` / tip PR #1059 squash-merged; tip-owner fold `q-mp-026s` / draft tip PR `#1083` (base `alpha`) advancing live tip HEAD. Round-27 backlog (`q-mp-090aa` / draft `#1116`, ids `q-mp-742`…`749`) and round-26 (`q-mp-090z` / draft `#1114`, ids `q-mp-717`…`721`) are **not** tip-carried yet — leave with `contained`. Round-25 (`q-mp-090y` / tip-carried `10y` + workers `#1084`–`#1115`) continues into post1059. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1059` @ `17063bd6` measures suite **3363** files / **14321** cases; nnnull **237**/237; void **47**/47; nullish **65**/65; unusedTypes live **29** vs baseline **36**; AGENTS + wiki tip **name** already **post1059**; wiki/testing-layers **count** cells still stale (owned by open `#1098`/`667`+`668` — leave with `contained`). Chromium e2e list **25** files / **249** cases. **eqeqeq live probe 0 / ceiling 1** headroom — **do not** clear product `==` in `*/rules.ts`; round-18 `543` already owns the ceiling drop. This doc lists **13 new** concrete engineering tasks (`q-mp-767` … `q-mp-779`) mined from the **live tip tree** @ `17063bd6`, checked against prior refills (`q-mp-090` … `q-mp-090aa` / ids through `q-mp-749`) and against the full open draft PR list. It is the **only** deliverable of `q-mp-090ab`.

**Honest count:** Only **13** tasks — not padded to 25. Unit coverage is near saturation; a full related-glob / suite view shows previously cold modules already at **100%** or owned by rounds ≤27 / open drafts. Knip unusedExports remain the intentional LEAVE barrel pair + AI `cancelFabAiRequests` (no SAFE deletes). Rank-3 unusedTypes headroom is still only `alignment/compat.ts` ×7 with no batch demote headroom. Lint successor chains after `#1116`/`742`–`744` land only on board-3d src, `*/rules.ts`, AI clients, or already-owned singles — **not** re-queued (prompt forbids board-3d src edits; hard rules HOLD AI/rules/scoring). This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** edits, demo coverage, harness shards, remasure/count-stamp inventories, tip-name stamps, `*types*` residuals, or anything in rounds ≤27. Payoffs are freshly measured: **docs that disagree with live GitHub PR state / CONTRIBUTING script guidance**, **remaining fixed `waitForTimeout` e2e sleeps outside `746`/`747`/`749`**, and **test-hygiene** adopting already-shared helpers with asserts + counts preserved.

**Preference:** SAFE, mutually independent **tests-only** or **docs-only** work. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket, copy-pins, boundaries/PWA, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps (`#1098` owns `667`/`668`). **Avoid** competing tickets already owned by open `#1084`–`#1116` / tip-carried `10y`/`10x`/`10w` / undrafted lint clears (`465`/`564`/`543`/`623`/`245`/`727`/…). Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** pursue optional-chain / radix / return-await **product** clears. **Do not** pursue eqeqeq product clears (ceiling drop stays with undrafted `#995`/`543`). **Do not** change fake-clock semantics (no real→fake timer product retargets).

**Lint policy for this refill:** **no** new ceiling-key clears. Void densest remaining hosts are `main` HOLD + board-3d (prompt skip src) + undrafted `465` prime-gold/types. Nnnull count=1 clearable non-rules hosts are all owned (`compat`/`695`, `attributes/types`/`624`, `dice-selector`/`650`, `owl-messages`/`743`, `owl-system`/`720`, `owl-component`/`670`) or AI/rules HOLD. Nullish count=1 leftovers are owned board-3d/`744` chain, owned chrome (`721`/`696`/`671`/…), undrafted controller batch `245`, or AI clients HOLD.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-749`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-10):

| Topic family                                                                                                                                                                                                                                                | Why skipped                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| round-27 backlog / void queens-board-3d / nnnull owl-messages / nullish fiar-board-3d / ceilings notes tip / canvas-dpr + contig-60 + sum-dominoes waits / router mock helper | open `#1116` `10aa` — leave with `contained`; **do not** re-queue `742`–`749` |
| round-26 backlog / alpha knip inventory 717 / testing-layers H2 718 / void prime-board-3d / nnnull owl-system / nullish juggle | open `#1114` `10z` + worker `#1115`/`717` — leave with `contained` |
| round-25 backlog / knip mermaid 692 / coverage-map tip 693 / void pent / nnnull compat / nullish owl-component / fiar layout + kings renderer / game types / tablet-gl / soft-fail navigate 706 / mutation-ui-timeout 707 | tip-carried `10y` + workers `#1084`–`#1113` — leave with `contained` |
| per-game UI coverage rounds / soft-fail characterizations / mutation-audit waves / board-3d **src** edits / demo coverage / harness shards (`fullgame/_harness` waits) / remasure inventories / tip-name stamps / `*types*` residuals | prompt hard-skip for round-28 |
| knip unusedExports (storage barrel LEAVE + `cancelFabAiRequests` AI) / Rank-3 compat ×7 demote / unusedTypes baseline 36→29 drop                                                                                                                           | intentional LEAVE / prior demote chain / remasure theater — leave alone |
| wiki/testing-layers **count** cells / AGENTS tip **name**                                                                                                                                                                                                   | tip name already post1059; counts owned by `#1098`/`667`–`668` |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts logic / copy / scoring / optional-chain or radix **product** clears / CI permissions **widening**                                                                                                       | hard-rule HOLD |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `17063bd6`)

| Id                                  | Title (short)                | Verdict                                                | Evidence @ `17063bd6`                                                                                 |
| ----------------------------------- | ---------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `q-mp-090aa` / `#1116`              | round-27 backlog 10aa        | **still-valid (open)**                                 | Leave open with `contained` — this refill starts after `749`.                                         |
| `q-mp-090z` / `#1114`               | round-26 backlog 10z         | **still-valid (open)**                                 | Leave open with `contained`.                                                                          |
| `q-mp-717` / `#1115`                | alpha-required-checks knip   | **still-valid (open)**                                 | Job inventory still omits `knip` until `#1115` folds — leave with `contained`.                        |
| `q-mp-718` / `#1114`                | testing-layers H2 post1023   | **still-valid (open)**                                 | H2 still reads `post1023 tip-owner remasure` — leave `#1114` alone.                                   |
| `q-mp-745` / `#1116`                | lint-ratchet notes tip       | **still-valid (open)**                                 | `lint-ratchet-ceilings.json` notes still `Tip post1023` — leave `#1116`.                              |
| `q-mp-746`–`749` / `#1116`          | e2e waits + router helper    | **still-valid (open)**                                 | This refill owns **other** wait sites + helper adoption — leave `#1116` alone.                        |
| `q-mp-667`–`668` / `#1098`          | wiki/testing-layers counts   | **still-valid (open)**                                 | Live **3363**/ **14321** vs docs **3341**/ **14072**; leave `#1098` — **do not** re-queue count stamps. |
| `q-mp-543` / `#995`                 | eqeqeq ceiling 1→0           | **still-valid (HOLD product; ceiling-only undrafted)** | Probe buckets **0**/1; **do not** re-queue.                                                           |

## Shared-file conflict flags

| Shared file                                   | Conflicting new ids                                                                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/e2e/canvas-dpr-resize.spec.ts`         | `770`/`771` helper adoption + open `#1116`/`746` wait replacement — serialize; adopt helpers **after** or **with** wait clears         |
| `tests/e2e/helpers/visual-stability.ts`       | `769` wait clears only — leave `waitForGameReady` re-export alone                                                                     |
| `tests/e2e/helpers/page.ts`                   | `770`/`771` consumers only — **no** API rewrite unless needed for optional `force` click                                               |
| `docs/wiki/development.md`                    | `767` + `779` (stale PR prose + a11y command) — serialize lightly with `#1098`/`667` count cells (**do not** edit count cells here)   |

**Parallel-friendly:** `q-mp-767`, `q-mp-768`, `q-mp-769`, `q-mp-772`–`q-mp-779` (no shared product files). Serialize `770`/`771` with each other and with `#1116`/`746` on `canvas-dpr-resize`.

## Live tip measurements (evidence snapshot @ `17063bd6`)

```text
$ git rev-parse HEAD
  17063bd60068c804214efd35c6c84ce28f1eeecf

$ npm run lint:ratchet
  ok   curly: 538 / ceiling 538
  ok   @typescript-eslint/no-non-null-assertion: 237 / ceiling 237
  ok   @typescript-eslint/no-confusing-void-expression: 47 / ceiling 47
  ok   radix: 6 / ceiling 6
  ok   default-case: 5 / ceiling 5
  ok   no-duplicate-imports: 42 / ceiling 42
  ok   @typescript-eslint/prefer-nullish-coalescing: 65 / ceiling 65
  ok   @typescript-eslint/prefer-optional-chain: 21 / ceiling 21
  ok   @typescript-eslint/switch-exhaustiveness-check: 8 / ceiling 8
  ok   @typescript-eslint/no-shadow: 3 / ceiling 3
  ok   eqeqeq: 1 / ceiling 1
  ok   @typescript-eslint/return-await: 3 / ceiling 3

$ npm run report:lint-buckets -- --rule eqeqeq
  eqeqeq: 0 / ceiling 1 (−1 headroom)
  (no hits)

$ npm run report:lint-buckets -- --rule '@typescript-eslint/no-non-null-assertion' --top 80
  count=1 clearable non-rules: compat / attributes/types / dice-selector /
    owl-messages / owl-system / owl-component (all owned) + hex/ai + */rules HOLD

$ npm run report:lint-buckets -- --rule '@typescript-eslint/prefer-nullish-coalescing' --top 80
  count=1 leftovers: owned chrome / board-3d / undrafted controllers 245 / AI clients

$ npm run typecheck:ratchet
  in-scope errors:     0
  out-of-scope errors: 216   ← AI residual (hard-rule HOLD)

$ npm run report:knip
  unusedExports: 3  unusedTypes: 29  unlisted: 3  duplicates: 0
  (NOTICE unusedTypes 36→29 shrink vs committed baseline 36)
  unusedExports = storage barrel LEAVE (isPlainProgressObject, sanitizeSettings)
                  + cancelFabAiRequests (AI HOLD) — no SAFE deletes

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3363

$ npx vitest list | wc -l
  14321

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ rg -n 'waitForTimeout' tests/e2e --glob '*.spec.ts' | rg -v 'canvas-dpr|contig-60-playability|sum-dominoes-deep'
  remaining fixed sleeps: queens-guards-playability (1×60) +
    mp3d-{kings,fiar,pent,kwatro,hex,prime,queens} (1–6 sites each)
  helpers: visual-stability.ts (2×100); fullgame/_harness skipped (harness shard)

$ gh pr view 658 --json state
  MERGED   ← wiki/development.md still says "Open draft #658"

$ docs/wiki/development.md:156
  a11y reproduce uses bare `npm run test:e2e -- --project=chromium …`
  ← disagrees with CONTRIBUTING preference for `test:e2e:chromium`

$ docs/dev/lint-ratchet-ceilings.json notes
  still "Tip post1023 …"  ← owned by #1116/745

$ docs/dev/testing-layers-2026-10-09.md H2
  still post1023 @ aa4386b4  ← owned by #1114/718
```

Open drafts into `cursor/mp-tip-post1059` at audit: `#1084`–`#1116` (coverage/docs/lint/backlog workers) + tip-fold `#1083` on `alpha`. No open draft owns backlog `10ab` / ids `767`–`779`.

---

## Tasks

### q-mp-767 · Docs: fix wiki stale “Open draft #658” (PR is MERGED)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (serialize lightly with `#1098`/`667` count cells — this ticket owns the **stale open-draft sentence** only; **do not** remasure unit file/case counts)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; wiki prose **demonstrably disagrees** with live GitHub state (`#658` is `MERGED`, not an open draft that “may change unit timing”)
- **target files:** `docs/wiki/development.md` tip paragraph sentence that cites “Open draft [#658]… may change unit **timing**” — rewrite to past tense / drop the open-draft claim (keep Hex Hard / CI=1 bench-skip guidance)
- **measured baseline:** `gh pr view 658 --json state` → `MERGED` (`q-mp-063: Unit-suite CI headroom…`). Live tip HEAD `17063bd6`. Wiki L122 still says “Open draft [#658]… may change unit **timing** (headroom)”.
- **acceptance criteria:** Wiki no longer claims `#658` is an open draft that may change timing; `check:dev-docs` clean; **no** competing total-count edits; no `src/` / CI permissions / ratchet edits.
- **verification commands:** `gh pr view 658 --json state,title` ; `rg -n '#658|Open draft' docs/wiki/development.md` ; `npm run check:dev-docs`
- **conflict notes:** leave `#1098`/`667`–`668` count cells alone; leave `#1114`/`718` testing-layers H2 alone; no ratchet JSON.

### q-mp-768 · E2E: replace fixed `waitForTimeout` in `queens-guards-playability` (keep asserts + test counts)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (leave `#1116`/`746`/`747`/`749` alone with `contained`)
- **series:** e2e-hygiene
- **verdict:** **SAFE** — tests-only harness harden; keep winner-banner / console asserts and test counts; **no** AI timing / Hex Hard / scoring edits
- **target files:** `tests/e2e/queens-guards-playability.spec.ts` (`waitForTimeout(60)` @ L187 after click-phase `evaluate`); no `src/` edits
- **measured baseline:** One fixed 60ms sleep remains in the human-move loop after board click phases. Chromium e2e list **25**/ **249**. Not owned by `746`/`747`/`749`.
- **acceptance criteria:** Fixed sleep replaced with a condition wait for phase-relevant DOM (status / AI turn / valid cell / winner) preserving the same loop break conditions and final asserts; `test(` count unchanged; suite green under `CI=1` Chromium; no `src/` / AI / copy edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/queens-guards-playability.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/queens-guards-playability.spec.ts` ; `rg -c '^\s*test\(' tests/e2e/queens-guards-playability.spec.ts`
- **conflict notes:** leave `mp3d-*` / `visual-stability` / fullgame harness waits alone; no ratchet JSON.

### q-mp-769 · E2E: replace fixed `waitForTimeout` in `visual-stability` helper (keep asserts + test counts)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **SAFE** — tests-only helper harden for visual baseline path; keep screenshot / opening asserts; **no** visual-baseline PNG rewrites unless a flake proves necessary (prefer condition waits over baseline churn)
- **target files:** `tests/e2e/helpers/visual-stability.ts` (`waitForTimeout(100)` @ L124 after modal/owl settle; `@ L134` in `openStartScreen`); consumers under `tests/e2e` visual specs only via imports — no `src/` edits
- **measured baseline:** Two fixed 100ms sleeps remain (sum **200ms** per opening/start path) after `neutralizeOwl` / font wait. Helper already re-exports shared `waitForGameReady` from `helpers/page.ts`.
- **acceptance criteria:** Fixed sleeps replaced with condition waits (paint / owl hidden / modal hidden / fonts ready) preserving the same opening/start contracts; visual project green under `CI=1` **or** documented flake with unchanged PNG baselines; no `src/` / AI edits; do **not** expand into fullgame harness waits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/helpers/visual-stability.ts` ; `CI=1 npx playwright test --project=visual-desktop --project=visual-phone` ; `npm run test:e2e:chromium -- --list` (case count stable)
- **conflict notes:** leave `#1116`/`746` canvas-dpr alone; no ratchet JSON; **not** a visual-baseline inventory remasure.

### q-mp-770 · Tests: adopt shared `waitForGameReady` from `helpers/page.ts` (drop local duplicates)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (serialize with `771` and lightly with `#1116`/`746` on `canvas-dpr-resize.spec.ts`)
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only fixture adoption; keep behavioral asserts and test counts; no soft-fail re-characterization
- **target files:** `tests/e2e/pointer-edge-cases.spec.ts`, `tests/e2e/history-routing.spec.ts`, `tests/e2e/zoom-reflow-a11y.spec.ts`, `tests/e2e/forced-colors-a11y.spec.ts`, `tests/e2e/storage-blocked.spec.ts` (use `{ timeoutMs: 20_000 }` if keeping that file’s longer loading wait), optionally `tests/e2e/canvas-dpr-resize.spec.ts` after/with `#1116`/`746`; import from `tests/e2e/helpers/page.ts`; no `src/` edits
- **measured baseline:** Six specs define near-identical local `waitForGameReady` (hide `game-loading` + show `#new-game-btn, h1`) while `helpers/page.ts` already exports the shared helper (`timeoutMs` / `requireChrome` options). `helpers/mp3d.ts` + `visual-stability.ts` already wrap the shared helper.
- **acceptance criteria:** Local duplicate defs removed in ≥4 of the listed specs; shared import used; asserts + Chromium/project test counts unchanged; targeted suites green under `CI=1`; no `src/` / copy / AI edits.
- **verification commands:** `rg -n 'async function waitForGameReady' tests/e2e --glob '*.spec.ts'` ; `CI=1 npx playwright test --project=chromium tests/e2e/pointer-edge-cases.spec.ts tests/e2e/history-routing.spec.ts` ; `npm run test:e2e:chromium -- --list`
- **conflict notes:** serialize with `771` + `#1116`/`746`; leave fullgame `_helpers.ts` alone (harness); no ratchet JSON.

### q-mp-771 · Tests: adopt shared `startHuman` from `helpers/page.ts` (drop local duplicates)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold or co-land of `770` preferred on overlapping specs; serialize with `#1116`/`746` on `canvas-dpr-resize`
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only fixture adoption; keep placement / a11y asserts and test counts; shared helper also dismisses owl (closer to production start path) — do **not** pin owl copy strings
- **target files:** `tests/e2e/pointer-edge-cases.spec.ts`, `tests/e2e/canvas-dpr-resize.spec.ts`, `tests/e2e/zoom-reflow-a11y.spec.ts` (and `forced-colors-a11y.spec.ts` only if `{ force: true }` can be expressed without product edits — otherwise leave that local variant with a one-line comment); import `startHuman` from `tests/e2e/helpers/page.ts`; no `src/` edits
- **measured baseline:** Local `startHuman` copies in pointer-edge / canvas-dpr / zoom / forced-colors duplicate the modal human-vs-human start path; shared `helpers/page.ts` `startHuman` already exists and calls `dismissOwl`.
- **acceptance criteria:** ≥2 local duplicates removed in favor of the shared helper; asserts + test counts unchanged; targeted suites green under `CI=1`; no `src/` / aria / copy edits.
- **verification commands:** `rg -n 'async function startHuman' tests/e2e --glob '*.spec.ts'` ; `CI=1 npx playwright test --project=chromium tests/e2e/pointer-edge-cases.spec.ts` ; `npm run test:e2e:chromium -- --list`
- **conflict notes:** serialize with `770` + `#1116`/`746`; leave `keyboard-only` `startHumanKeyboard` alone (different path); no ratchet JSON.

### q-mp-772 · E2E: replace fixed `waitForTimeout` in `mp3d-kings-board3d` (keep asserts + test counts) — [HOLD-CHECK: board-3d e2e]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **HOLD-CHECK** — mp3d board-3d e2e adjacency; tests-only condition waits under tip-owner guardrail; **no** `src/ui/three/*` edits
- **target files:** `tests/e2e/mp3d-kings-board3d.spec.ts` (`waitForTimeout(120)` after click helper); no `src/` edits
- **measured baseline:** **1** fixed sleep / **120ms**. Prefer `waitForHumanStatus` / a11y cell / status text already exported from `tests/e2e/helpers/mp3d.ts` where applicable.
- **acceptance criteria:** Fixed sleep replaced with condition wait preserving the same 2D-fallback / 3D placement / screenshot asserts; test counts unchanged; suite green under `CI=1` Chromium; no board-3d src / AI / copy edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/mp3d-kings-board3d.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/mp3d-kings-board3d.spec.ts`
- **conflict notes:** leave other `mp3d-*` files to sibling ids; no ratchet JSON; **not** a board-3d branch-gap / src lint clear.

### q-mp-773 · E2E: replace fixed `waitForTimeout` in `mp3d-fiar-board3d` (keep asserts + test counts) — [HOLD-CHECK: board-3d e2e]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **HOLD-CHECK** — mp3d board-3d e2e adjacency; tests-only; **no** `src/ui/three/fiar-board-3d.ts` edits (nullish clear stays with `#1116`/`744`)
- **target files:** `tests/e2e/mp3d-fiar-board3d.spec.ts` (`waitForTimeout(120|200)` @ click helper + mid-game settle); no `src/` edits
- **measured baseline:** **2** sites / sum **320ms**.
- **acceptance criteria:** Fixed sleeps → condition waits; asserts + counts preserved; Chromium green under `CI=1`; no board-3d src / AI edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/mp3d-fiar-board3d.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/mp3d-fiar-board3d.spec.ts`
- **conflict notes:** leave `#1116`/`744` src nullish alone; no ratchet JSON.

### q-mp-774 · E2E: replace fixed `waitForTimeout` in `mp3d-pent-em-in-board3d` (keep asserts + test counts) — [HOLD-CHECK: board-3d e2e]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **HOLD-CHECK** — mp3d board-3d e2e adjacency; tests-only; **no** `src/ui/three/pent-em-in-board-3d.ts` edits
- **target files:** `tests/e2e/mp3d-pent-em-in-board3d.spec.ts` (`waitForTimeout(150|250)`); no `src/` edits
- **measured baseline:** **2** sites / sum **400ms**.
- **acceptance criteria:** Fixed sleeps → condition waits; asserts + counts preserved; Chromium green under `CI=1`; no board-3d src / AI edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/mp3d-pent-em-in-board3d.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/mp3d-pent-em-in-board3d.spec.ts`
- **conflict notes:** leave `#1099`/`694` void src clear alone; no ratchet JSON.

### q-mp-775 · E2E: replace fixed `waitForTimeout` in `mp3d-kwatro-sinko-board3d` (keep asserts + test counts) — [HOLD-CHECK: board-3d e2e]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **HOLD-CHECK** — mp3d board-3d e2e adjacency; tests-only; **no** board-3d src edits
- **target files:** `tests/e2e/mp3d-kwatro-sinko-board3d.spec.ts` (`waitForTimeout(150|300|200|250)`); no `src/` edits
- **measured baseline:** **4** sites / sum **900ms**.
- **acceptance criteria:** Fixed sleeps → condition waits; asserts + counts preserved; Chromium green under `CI=1`; no board-3d src / AI edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/mp3d-kwatro-sinko-board3d.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/mp3d-kwatro-sinko-board3d.spec.ts`
- **conflict notes:** leave tip-carried `#1082`/`669` void src clear alone; no ratchet JSON.

### q-mp-776 · E2E: replace fixed `waitForTimeout` in `mp3d-hex-a-gone-board3d` (keep asserts + test counts) — [HOLD-CHECK: board-3d e2e / Hex adjacency]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **HOLD-CHECK** — hex-a-gone mp3d e2e; tests-only condition waits; **do not** touch Hex Hard **450ms** assert or `src/games/hex/ai.ts`; **no** board-3d src edits
- **target files:** `tests/e2e/mp3d-hex-a-gone-board3d.spec.ts` (`waitForTimeout(80|50|250|200|250|250)`); no `src/` edits
- **measured baseline:** **6** sites / sum **1080ms**.
- **acceptance criteria:** Fixed sleeps → condition waits; asserts + counts preserved; Chromium green under `CI=1`; Hex Hard **450ms** untouched; no AI / board-3d src edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/mp3d-hex-a-gone-board3d.spec.ts` ; `rg -n 'hard:\\s*450' src/games/hex/ai.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/mp3d-hex-a-gone-board3d.spec.ts`
- **conflict notes:** leave `#1020`/`579` void src clear alone; no ratchet JSON.

### q-mp-777 · E2E: replace fixed `waitForTimeout` in `mp3d-prime-gold-board3d` (keep asserts + test counts) — [HOLD-CHECK: board-3d e2e]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **HOLD-CHECK** — mp3d board-3d e2e adjacency; tests-only; prefer existing `primeGoldValidA11yCell` / `waitForHumanStatus` helpers; **no** board-3d src edits
- **target files:** `tests/e2e/mp3d-prime-gold-board3d.spec.ts` (`waitForTimeout(120|150|150|200|300|300)`); no `src/` edits
- **measured baseline:** **6** sites / sum **1220ms**.
- **acceptance criteria:** Fixed sleeps → condition waits; asserts + counts preserved; Chromium green under `CI=1`; no board-3d src / AI edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/mp3d-prime-gold-board3d.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/mp3d-prime-gold-board3d.spec.ts`
- **conflict notes:** leave `#1114`/`719` void src clear alone; no ratchet JSON.

### q-mp-778 · E2E: replace fixed `waitForTimeout` in `mp3d-queens-guards-board3d` (keep asserts + test counts) — [HOLD-CHECK: board-3d e2e]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** e2e-hygiene
- **verdict:** **HOLD-CHECK** — mp3d board-3d e2e adjacency; tests-only; **no** `src/ui/three/queens-guards-board-3d.ts` edits (void clear stays with `#1116`/`742`)
- **target files:** `tests/e2e/mp3d-queens-guards-board3d.spec.ts` (`waitForTimeout(150|150|300|200|250|200)`); no `src/` edits
- **measured baseline:** **6** sites / sum **1250ms**.
- **acceptance criteria:** Fixed sleeps → condition waits; asserts + counts preserved; Chromium green under `CI=1`; no board-3d src / AI edits.
- **verification commands:** `rg -n 'waitForTimeout' tests/e2e/mp3d-queens-guards-board3d.spec.ts` ; `CI=1 npx playwright test --project=chromium tests/e2e/mp3d-queens-guards-board3d.spec.ts`
- **conflict notes:** leave `#1116`/`742` void src clear + `768` 2D playability alone; no ratchet JSON.

### q-mp-779 · Docs: wiki a11y-sweep reproduce → prefer `test:e2e:chromium`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (serialize lightly with `767` on the same wiki page)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; wiki testing-layers table **demonstrably disagrees** with `CONTRIBUTING.md` / `AGENTS.md` guidance to prefer `npm run test:e2e:chromium` over bare `npm run test:e2e`
- **target files:** `docs/wiki/development.md` a11y-sweep local-reproduce cell (currently `` `npm run test:e2e -- --project=chromium tests/e2e/a11y-sweep.spec.ts` ``) → `` `npm run test:e2e:chromium -- tests/e2e/a11y-sweep.spec.ts` `` (equivalent under `package.json`; matches CONTRIBUTING)
- **measured baseline:** `package.json` `test:e2e:chromium` = `playwright test --project=chromium --grep-invert @fullgame`. CONTRIBUTING: “Prefer `npm run test:e2e:chromium` over bare `npm run test:e2e`”. Wiki L156 still uses bare `test:e2e -- --project=chromium …`.
- **acceptance criteria:** Wiki a11y reproduce uses `test:e2e:chromium`; `check:dev-docs` clean; no count-cell remasure; no `src/` / CI workflow edits.
- **verification commands:** `node -e "console.log(require('./package.json').scripts['test:e2e:chromium'])"` ; `rg -n 'a11y-sweep|test:e2e:chromium' docs/wiki/development.md CONTRIBUTING.md` ; `npm run check:dev-docs`
- **conflict notes:** serialize with `767`; leave `#1098` count cells alone; no ratchet JSON.

---

## Id allocation

New ids in this doc: **`q-mp-767` … `q-mp-779`** (**13** tasks — fewer than 25; no filler).  
Ids `q-mp-750`…`q-mp-766` are intentionally unused in this refill (gap after round-27 `742`…`749`).  
Do **not** reuse `q-mp-001`–`q-mp-749`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post1059`.

**Ceiling keys used in this refill:** **none** (board-3d src / owned singles / AI-rules HOLD exhausted the SAFE lint chain).  
**Not used here (already claimed / undrafted / HOLD / no headroom / prompt-skipped families):** void/nnnull/nullish successors after `#1116`/`742`–`744`, eqeqeq ceiling (`#995`/`543`), optional-chain product clears (`#982` HOLD), knip demote / unusedTypes baseline drop, wiki count remasure (`#1098`/`667`–`668`), tip-name stamps (`#1114`/`718`, `#1116`/`745`, `#1099`/`692`–`693`), UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** edits, harness shards (`fullgame/_harness` waits), demo coverage, residual top-ups on modules already **>90%** on both metrics with miss&lt;2, `*types*` residuals (`700`–`704`), open post1059 workers `#1084`–`#1116`, `#1116`/`746`–`749` wait/helper sites.

Prefer parallel start on: **767**, **768**, **769**, **772**–**779** (serialize **770**/**771** with each other and `#1116`/`746`).

**One-line id tags:** `767 SAFE`, `768 SAFE`, `769 SAFE`, `770 SAFE`, `771 SAFE`, `772 HOLD-CHECK`, `773 HOLD-CHECK`, `774 HOLD-CHECK`, `775 HOLD-CHECK`, `776 HOLD-CHECK`, `777 HOLD-CHECK`, `778 HOLD-CHECK`, `779 SAFE`.

**Next action: fold into tip by the tip owner.**
