# Engineering backlog — 2026-10-10ac (tip refill after post1059 mid-fold / round-29)

**Task id:** `q-mp-090ac`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post1059` @ `2c70fbc0` (full `2c70fbc0d139c0f7b8ca3c6383d572b1f53369e6`)  
**Depends on:** tip cut after `q-mp-026r` / tip PR #1059 squash-merged; tip-owner fold `q-mp-026s` / draft tip PR `#1083` (base `alpha`) advancing live tip HEAD. Round-28 backlog (`q-mp-090ab` / draft `#1121`, ids `q-mp-767`…`779`) and round-27 (`q-mp-090aa` / tip-carried `10aa` + workers `#1116`–`#1120`) are **not** all tip-carried yet — leave with `contained`. Tip HEAD continues to move as tip-owner folds green drafts — **rebase onto latest tip before opening worker PRs**.

## Purpose

The tip `cursor/mp-tip-post1059` @ `2c70fbc0` measures suite **3366** files / **14347** cases; nnnull **237**/237; void **47**/47; nullish **65**/65; unusedTypes live **29** vs baseline **36**; AGENTS tip **name** already **post1059**; wiki/testing-layers **count** cells still stale (owned by open `#1098`/`667`+`668` — leave with `contained`). Chromium e2e list **25** files / **249** cases. **`npm run lint:ratchet` eqeqeq 1 / ceiling 1**, but **`npm run report:lint-buckets -- --rule eqeqeq` falsely reports 0 / 1** because its probe overlay omits `eqeqeq: ['error', 'always']` while claiming identity with `check-lint-ratchet.mjs` — primary tooling bug for this refill. Knip unusedExports remain the intentional LEAVE barrel pair + AI `cancelFabAiRequests` (no SAFE deletes; unusedFiles **0**). This doc lists **16 new** concrete engineering tasks (`q-mp-792` … `q-mp-807`) mined from the **live tip tree** @ `2c70fbc0`, checked against prior refills (`q-mp-090` … `q-mp-090ab` / ids through `q-mp-779`) and against the full open draft PR list. It is the **only** deliverable of `q-mp-090ac`.

**Honest count:** Only **16** tasks — not padded to 25. Round-28 already claimed the remaining fixed `waitForTimeout` e2e sites (incl. 8× mp3d HOLD-CHECK) plus wiki `#658` / a11y reproduce cells. Unit coverage / lint successors remain saturated or owned; knip has **no** SAFE unusedExports. Slowest unit wall is still AI determinism / calibration / play-deadline (hard-rule HOLD — not queued). Non-AI isolate files remeasured here are already ≤~1.6s (registry contract) / ≤~2.6s (`existing-games-controllers`) with no proven in-file speedup that is not a forbidden harness shard. This refill **does not** re-queue per-game UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** or **mp3d e2e** edits, demo coverage, harness shards, remasure/count-stamp inventories, tip-name stamps, `*types*` residuals, Queens & Guards product work, AI timing, or anything in rounds ≤28. Payoffs are freshly measured: **script/tooling probe drift**, **docs that disagree with `package.json` preferred scripts**, **test-helper adoption** of already-shared helpers (asserts unchanged), and **non-src deep-playtest / audit script** fixed-sleep hygiene away from board-3d / Queens & Guards.

**Preference:** SAFE, mutually independent **tests-only**, **docs-only**, or **scripts/** tooling work. **Do not** queue another remasure of CI wall, bundle headroom, lint-bucket snapshot, copy-pins, boundaries/PWA, board-3d layout inventory, CI permissions, tip-pointer / tip-name sweep theater, open-draft triage, emit-identity, knip drift, dead-CSS Rank-1 rescan, coverage-map heat regenerate, or wiki **count** stamps (`#1098` owns `667`/`668`). **Avoid** competing tickets already owned by open `#1084`–`#1121` / tip-carried `10y`/`10z`/`10aa`. Anything in rules / AI / scoring / legal-move paths, player-facing copy, tutorials product edits, timing, Stars & Bars history cap, Hex Hard 450ms, or CI permissions widening is **HOLD**. **Do not** change fake-clock semantics (no real→fake timer product retargets).

**Lint policy for this refill:** **no** new ceiling-key clears (board-3d src / owned singles / AI-rules HOLD). Tooling fix for `report:lint-buckets` probe drift is allowed and does **not** change ceilings.

## Duplicate check (do not re-queue)

Skipped topics already covered by `q-mp-176`–`q-mp-779`, open drafts, or prior ids (non-exhaustive; `gh pr list --state open` 2026-10-10):

| Topic family                                                                                                                                                                                                                                                | Why skipped                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| round-28 backlog / wiki `#658` / queens-guards-playability waits / visual-stability waits / `waitForGameReady`+`startHuman` adoption / mp3d e2e waits / wiki a11y reproduce | open `#1121` `10ab` — leave with `contained`; **do not** re-queue `767`–`779` |
| round-27 backlog / void queens-board-3d / nnnull owl-messages / nullish fiar-board-3d / ceilings notes tip / canvas-dpr + contig-60 + sum-dominoes waits / router mock helper | tip-carried `746` + open `#1116`/`#1117`–`#1120` — leave with `contained` |
| round-26 / knip alpha inventory 717 / testing-layers H2 718 / void prime / nnnull owl-system / nullish juggle | tip-carried `717` + open `#1114` — leave with `contained` |
| per-game UI coverage rounds / soft-fail characterizations / mutation-audit waves / board-3d **src** or **mp3d e2e** / demo coverage / harness shards / remasure inventories / tip-name stamps / `*types*` residuals | prompt hard-skip for round-29 |
| knip unusedExports (storage barrel LEAVE + `cancelFabAiRequests` AI) / Rank-3 compat ×7 demote / unusedTypes baseline 36→29 drop                                                                                                                           | intentional LEAVE / prior demote chain / remasure theater — leave alone |
| wiki/testing-layers **count** cells / AGENTS tip **name**                                                                                                                                                                                                   | tip name already post1059; counts owned by `#1098`/`667`–`668` |
| AI-timing / Hex Hard 450ms / history-cap / rules.ts logic / copy / scoring / optional-chain or radix **product** clears / CI permissions **widening** / Queens & Guards product                                                                                                       | hard-rule HOLD |

Also skipped: Merom / Sullivan / data-center / grants / nonprofit; `pappas-infrastructure`; meromhouse agents; any CI `permissions` widening, apt, or network-in-tests work. No `memory/` files.

## Stale queue re-check (live tip `2c70fbc0`)

| Id                                  | Title (short)                | Verdict                                                | Evidence @ `2c70fbc0`                                                                                 |
| ----------------------------------- | ---------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `q-mp-090ab` / `#1121`              | round-28 backlog 10ab        | **still-valid (open)**                                 | Leave open with `contained` — this refill starts after `779`.                                         |
| `q-mp-090aa` / `#1116`              | round-27 backlog 10aa        | **still-valid (open)**                                 | Leave open with `contained`.                                                                          |
| `q-mp-767` / `#1121`                | wiki stale Open draft #658   | **still-valid (open)**                                 | `gh pr view 658` → `MERGED`; wiki L122 still claims open draft — leave `#1121`.                       |
| `q-mp-779` / `#1121`                | wiki a11y → `test:e2e:chromium` | **still-valid (open)**                              | Wiki L156 still bare `test:e2e -- --project=chromium` — leave `#1121`; this refill owns **sibling docs**. |
| `q-mp-770`–`771` / `#1121`          | adopt waitForGameReady / startHuman | **still-valid (open)**                          | This refill owns **`gotoGame`** adoption only — leave `#1121`.                                        |
| `q-mp-746`                          | canvas-dpr condition waits   | **tip-carried**                                        | HEAD `2c70fbc0` is the fold; local `gotoGame`/`startHuman` dupes may remain for `801` / `#1121`.      |
| `q-mp-717`                          | alpha-required-checks knip   | **tip-carried**                                        | Live `docs/dev/alpha-required-checks-q-mp-056.md` already lists `knip` — leave open `#1115` with `contained`. |
| `q-mp-667`–`668` / `#1098`          | wiki/testing-layers counts   | **still-valid (open)**                                 | Live **3366**/ **14347** vs docs **3341**/ **14072**; leave `#1098` — **do not** re-queue count stamps. |
| `q-mp-543` / `#995`                 | eqeqeq ceiling 1→0           | **still-valid (HOLD product; ceiling-only undrafted)** | Ratchet **1**/1; buckets falsely **0**/1 until `792` — **do not** re-queue product clear.             |

## Shared-file conflict flags

| Shared file                                   | Conflicting new ids                                                                                                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `scripts/report-lint-buckets.mjs`             | `792` (eqeqeq overlay fix) then `793` (extract shared probe) — serialize; `793` may also touch `check-lint-ratchet.mjs` |
| `scripts/check-lint-ratchet.mjs`              | `793` only (after `792`)                                                                                               |
| `docs/dev/lint-bucket-report.md`              | `792` (document probe must include eqeqeq) — prose only                                                                |
| `tests/e2e/pointer-edge-cases.spec.ts` / `canvas-dpr-resize.spec.ts` | `801` gotoGame adoption — serialize lightly with `#1121`/`770`/`771`                                  |
| `.github/workflows/ci.yml`                    | `800` command-only swap inside existing `e2e-cross-browser` job — **do not** rename the job / check                     |

**Parallel-friendly:** `q-mp-794`–`q-mp-799`, `q-mp-802`–`q-mp-807` (no shared product files). Serialize `792`→`793`; serialize `801` with `#1121`/`770`/`771`.

## Live tip measurements (evidence snapshot @ `2c70fbc0`)

```text
$ git rev-parse HEAD
  2c70fbc0d139c0f7b8ca3c6383d572b1f53369e6

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
  eqeqeq: 0 / ceiling 1 (−1 headroom)   ← FALSE (probe missing eqeqeq always)
  (no hits)

$ # Controlled repro of overlay drift (temp probe, deleted after):
$ # WITH eqeqeq always → count=1 (rules.ts)
$ # WITHOUT eqeqeq (buckets today) → count=0

$ npm run typecheck:ratchet
  in-scope errors:     0
  out-of-scope errors: 216   ← AI residual (hard-rule HOLD)

$ npm run report:knip
  unusedExports: 3  unusedTypes: 29  unlisted: 3  duplicates: 0  unusedFiles: 0
  unusedExports = storage barrel LEAVE (isPlainProgressObject, sanitizeSettings)
                  + cancelFabAiRequests (AI HOLD) — no SAFE deletes

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3366

$ npx vitest list | wc -l
  14347

$ npm run test:e2e:chromium -- --list
  Total: 249 tests in 25 files

$ CI=1 npx vitest run --project unit-node --reporter=json
  Top wall: ai-determinism-shard-d/e/a + ai-calibration + state-roundtrip-fuzz
  (AI shards / calibration / play-deadline = HOLD — not queued)
  Non-AI isolate remasure: burn-1008-registry 129 tests / ~1.6s;
    existing-games-controllers 67 tests / ~2.6s — no proven non-shard speedup

$ gh pr view 658 --json state
  MERGED   ← wiki still says "Open draft #658" (owned by #1121/767)

$ docs/a11y-sweep-2026-10-07.md + a11y-axe / post477 / keyboard-sr / offline-resilience
  still use bare `npm run test:e2e -- --project=chromium` or `npx playwright test --project=chromium`
  ← disagrees with CONTRIBUTING preference for `test:e2e:chromium`

$ docs/cross-browser-2026-10-07.md + ci.yml e2e-cross-browser step
  still `npm run test:e2e -- --project=firefox --project=webkit`
  ← package.json already has equivalent `test:e2e:firefox-webkit`

$ rg -n 'waitForTimeout' scripts/*deep-playtest*.mjs scripts/render-perf-mode.mjs …
  ramrod 8 / calla 2 / par-55 5 / sum-dominoes 6 / stars-bars 7 /
  render-perf 5 / memory-leak 4 / nav-away 3
```

Open drafts into `cursor/mp-tip-post1059` at audit: `#1084`–`#1121` + tip-fold `#1083` on `alpha`. No open draft owns backlog `10ac` / ids `792`–`807`.

---

## Tasks

### q-mp-792 · Scripts: fix `report-lint-buckets` missing `eqeqeq` probe overlay (match lint:ratchet)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P1 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (serialize `793` after this)
- **series:** script-tooling
- **verdict:** **SAFE** — non-src script bug; restores report fidelity; **no** ceiling number edits; **no** product `==` clears in `*/rules.ts` (ceiling drop stays with undrafted `#995`/`543`)
- **target files:** `scripts/report-lint-buckets.mjs` (add `eqeqeq: ['error', 'always']` + comment matching ratchet); optionally one-line note in `docs/dev/lint-bucket-report.md` that the probe includes stricter eqeqeq; optional unit pin under `tests/unit/` that the buckets probe source string contains `eqeqeq`
- **measured baseline:** `lint:ratchet` → **eqeqeq 1 / ceiling 1**. `report:lint-buckets -- --rule eqeqeq` → **0 / 1** with “(no hits)”. Controlled eslint probe: with `eqeqeq always` → **1** hit in `rules.ts`; without → **0**. Comment in buckets script claims “Identical overlay to check-lint-ratchet.mjs”.
- **acceptance criteria:** `report:lint-buckets -- --rule eqeqeq` reports **1 / ceiling 1** (matching ratchet); probe overlay rule set matches ratchet for all ceiling keys; no ceiling JSON number changes; no `src/` product edits; `npm run lint:ratchet` still green.
- **verification commands:** `npm run report:lint-buckets -- --rule eqeqeq` ; `npm run lint:ratchet` ; `rg -n "eqeqeq:" scripts/report-lint-buckets.mjs scripts/check-lint-ratchet.mjs`
- **conflict notes:** serialize with `793`; leave `#995`/`543` ceiling drop alone; no ratchet JSON number edits.

### q-mp-793 · Scripts: extract shared lint-ratchet probe overlay (stop buckets/ratchet drift)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold or co-land of `792` (eqeqeq must be in the shared overlay first)
- **series:** script-tooling
- **verdict:** **SAFE** — non-src refactor; single source of truth for the ceiling probe; behavior preserved
- **target files:** new shared module under `scripts/` (e.g. `scripts/lint-ratchet-probe.mjs` or `scripts/lib/…`); update `scripts/check-lint-ratchet.mjs` + `scripts/report-lint-buckets.mjs` to import it; touch `docs/dev/lint-bucket-report.md` path refs if needed
- **measured baseline:** Two nearly identical `probeSource` template strings; buckets already drifted once (missing eqeqeq). Help text in both claims they stay in sync.
- **acceptance criteria:** One shared probe builder; both scripts import it; `lint:ratchet` green; `report:lint-buckets -- --rule eqeqeq` matches ratchet totals; no ceiling number edits; no `src/` edits.
- **verification commands:** `npm run lint:ratchet` ; `npm run report:lint-buckets -- --rule eqeqeq` ; `npm run report:lint-buckets -- --json` ; `rg -n 'probeSource|lint-ratchet-probe' scripts/`
- **conflict notes:** after `792`; no CI workflow edits.

### q-mp-794 · Docs: `a11y-sweep` reproduce → prefer `test:e2e:chromium`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (leave `#1121`/`779` wiki cell alone with `contained`)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; active how-to **demonstrably disagrees** with CONTRIBUTING / `package.json` preferred script
- **target files:** `docs/a11y-sweep-2026-10-07.md` (L9 run line + L46 verify block) → `npm run test:e2e:chromium -- …`
- **measured baseline:** Doc uses `npm run test:e2e -- --project=chromium …`. `package.json` `test:e2e:chromium` = `playwright test --project=chromium --grep-invert @fullgame`. CONTRIBUTING: prefer `test:e2e:chromium`.
- **acceptance criteria:** Doc reproduce uses `test:e2e:chromium`; no count-cell remasure; no `src/` / CI workflow edits.
- **verification commands:** `node -e "console.log(require('./package.json').scripts['test:e2e:chromium'])"` ; `rg -n 'test:e2e' docs/a11y-sweep-2026-10-07.md CONTRIBUTING.md`
- **conflict notes:** leave `#1121`/`779` wiki alone; no ratchet JSON.

### q-mp-795 · Docs: `a11y-axe-audit` reproduce → prefer `test:e2e:chromium`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; bare `npx playwright test --project=chromium` disagrees with preferred npm script
- **target files:** `docs/a11y-axe-audit-2026-10-07.md` (enforce + verify commands)
- **measured baseline:** L15 / L36 use `npx playwright test --project=chromium tests/e2e/a11y-axe.spec.ts` (optional `A11Y_AXE_ENFORCE=1` env prefix may stay).
- **acceptance criteria:** Commands prefer `npm run test:e2e:chromium -- tests/e2e/a11y-axe.spec.ts` (env prefix OK); no `src/` edits.
- **verification commands:** `rg -n 'playwright|test:e2e:chromium' docs/a11y-axe-audit-2026-10-07.md` ; `node -e "console.log(require('./package.json').scripts['test:e2e:chromium'])"`
- **conflict notes:** none.

### q-mp-796 · Docs: `a11y-post477-resweep` reproduce → prefer `test:e2e:chromium`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only
- **target files:** `docs/a11y-post477-resweep-2026-10-09.md` (L38–L40 command block)
- **measured baseline:** Three bare `npx playwright test --project=chromium …` lines for a11y-sweep / a11y-axe / keyboard specs.
- **acceptance criteria:** Prefer `npm run test:e2e:chromium -- <specs>`; no `src/` edits.
- **verification commands:** `rg -n 'playwright|test:e2e:chromium' docs/a11y-post477-resweep-2026-10-09.md`
- **conflict notes:** serialize lightly with `794`/`795`/`797` (different files — parallel OK).

### q-mp-797 · Docs: `keyboard-sr-audit` reproduce → prefer `test:e2e:chromium`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only
- **target files:** `docs/keyboard-sr-audit-2026-10-07.md` (L82)
- **measured baseline:** `npx playwright test --project=chromium tests/e2e/keyboard-only.spec.ts`.
- **acceptance criteria:** Prefer `npm run test:e2e:chromium -- tests/e2e/keyboard-only.spec.ts`; no aria/copy product edits.
- **verification commands:** `rg -n 'playwright|test:e2e:chromium' docs/keyboard-sr-audit-2026-10-07.md`
- **conflict notes:** none.

### q-mp-798 · Docs: `offline-resilience` reproduce → prefer `test:e2e:chromium`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only
- **target files:** `docs/offline-resilience-2026-10-07.md` (L64)
- **measured baseline:** `npx playwright test --project=chromium tests/e2e/chunk-load-retry.spec.ts`.
- **acceptance criteria:** Prefer `npm run test:e2e:chromium -- tests/e2e/chunk-load-retry.spec.ts`; no `src/` / service-worker product edits.
- **verification commands:** `rg -n 'playwright|test:e2e:chromium' docs/offline-resilience-2026-10-07.md`
- **conflict notes:** none.

### q-mp-799 · Docs: `cross-browser` CI reproduce → prefer `test:e2e:firefox-webkit`

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 docs
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (serialize lightly with `800` if both land)
- **series:** docs-accuracy
- **verdict:** **SAFE** — docs only; doc cites bare `test:e2e -- --project=firefox --project=webkit` while `package.json` already defines the equivalent named script
- **target files:** `docs/cross-browser-2026-10-07.md` (L40 and any sibling reproduce lines)
- **measured baseline:** `package.json` `test:e2e:firefox-webkit` = `playwright test --project=firefox --project=webkit`. Doc still documents the bare form.
- **acceptance criteria:** Doc prefers `npm run test:e2e:firefox-webkit`; may note equivalence; no job-name / permissions edits.
- **verification commands:** `node -e "console.log(require('./package.json').scripts['test:e2e:firefox-webkit'])"` ; `rg -n 'test:e2e' docs/cross-browser-2026-10-07.md`
- **conflict notes:** serialize with `800`; leave mermaid `#1100`/`692` alone.

### q-mp-800 · CI: `e2e-cross-browser` step → `npm run test:e2e:firefox-webkit` (job name unchanged)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P2 tests-ratchets-CI
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (prefer after/with `799` docs)
- **series:** ci-hygiene
- **verdict:** **SAFE** — equivalent command swap inside existing report-only job; **do not** rename the GitHub check / job (`e2e-cross-browser` stays); **do not** widen `permissions` or touch `persist-credentials`
- **target files:** `.github/workflows/ci.yml` (`e2e-cross-browser` run step currently `npm run test:e2e -- --project=firefox --project=webkit`); update any unit contract that pins the old argv if present
- **measured baseline:** Live CI step uses bare `test:e2e -- --project=firefox --project=webkit`. Named script exists and matches. `tests/unit/ci-permissions-persist-credentials-pin.test.ts` already lists job name `e2e-cross-browser`.
- **acceptance criteria:** Step invokes `npm run test:e2e:firefox-webkit`; job id / check name unchanged; `permissions: contents: read` + `persist-credentials: false` untouched; `npm run check:workflows` OK; workflow contract unit tests green.
- **verification commands:** `rg -n 'e2e-cross-browser:|test:e2e:firefox-webkit|test:e2e -- --project=firefox' .github/workflows/ci.yml` ; `npm run check:workflows` ; `npx vitest run --project unit-shared tests/unit/ci-permissions-persist-credentials-pin.test.ts tests/unit/workflow-contract.test.ts`
- **conflict notes:** leave `#1100`/`692` mermaid alone; no permissions widening.

### q-mp-801 · Tests: adopt shared `gotoGame` from `helpers/page.ts` (drop local duplicates)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** fold or co-land of `#1121`/`770` preferred on overlapping specs; serialize with tip-carried `746` on `canvas-dpr-resize`
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only fixture adoption; keep asserts + test counts; no soft-fail re-characterization
- **target files:** `tests/e2e/pointer-edge-cases.spec.ts`, `tests/e2e/canvas-dpr-resize.spec.ts` (local `gotoGame` → import from `tests/e2e/helpers/page.ts`); no `src/` edits
- **measured baseline:** Two specs define local `gotoGame` as `page.goto(/#/game/…)` + `waitForGameReady` while `helpers/page.ts` already exports shared `gotoGame`.
- **acceptance criteria:** Local `gotoGame` defs removed in both specs; shared import used; asserts + Chromium test counts unchanged; targeted suites green under `CI=1`; no `src/` / copy / AI edits.
- **verification commands:** `rg -n 'async function gotoGame' tests/e2e --glob '*.spec.ts'` ; `CI=1 npx playwright test --project=chromium tests/e2e/pointer-edge-cases.spec.ts tests/e2e/canvas-dpr-resize.spec.ts` ; `npm run test:e2e:chromium -- --list`
- **conflict notes:** serialize with `#1121`/`770`/`771`; leave fullgame harness alone; no ratchet JSON.

### q-mp-802 · Tests: adopt shared `storage-stubs` (`securityError` / `quotaError`) in unit suites

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tests-hygiene
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** test-hygiene
- **verdict:** **SAFE** — tests-only helper adoption; keep behavioral asserts and test counts; no storage product edits
- **target files:** unit files that inline `new DOMException(..., 'SecurityError'|'QuotaExceededError')` without importing `tests/helpers/storage-stubs.ts` — measured hosts: `tests/unit/durable-progress-persistence.test.ts`, `tests/unit/storage-save-migration-fixtures.test.ts`, `tests/unit/mutation-ui-safe-web-storage.test.ts`, `tests/unit/mutation-ui10-safe-web-storage.test.ts`, `tests/unit/burn-1008-ui-cov-r3-storage-settings.test.ts`, `tests/unit/burn-wave36-storage-savenow-quota.test.ts` (and any sibling still inlining after tip rebase); import `securityError` / `quotaError` / `withThrowingLocalStorageAccess` as fits; no `src/` edits
- **measured baseline:** Shared helpers already used by `safe-web-storage.test.ts` + `q-mp-455-…`. ≥6 other files still construct identical DOMExceptions inline.
- **acceptance criteria:** ≥4 listed files import shared stubs instead of inlining; asserts + case counts unchanged; targeted `npm run test:unit` paths green; no `src/` / copy edits.
- **verification commands:** `rg -n "new DOMException" tests/unit --glob '*storage*' --glob '*durable*'` ; `rg -n "from ['\"].*storage-stubs" tests/unit --glob '*.ts'` ; `CI=1 npx vitest run --project unit-isolated tests/unit/durable-progress-persistence.test.ts tests/unit/storage-save-migration-fixtures.test.ts`
- **conflict notes:** leave soft-fail characterization tickets alone; no ratchet JSON.

### q-mp-803 · Scripts: replace fixed `waitForTimeout` in `ramrod-deep-playtest` (keep playtest outcomes)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** script-hygiene
- **verdict:** **SAFE** — non-src headless playtest script; condition waits for status / valid cells / modal; **no** Ramrod rules / scoring / AI product edits
- **target files:** `scripts/ramrod-deep-playtest.mjs` (**8** `waitForTimeout` sites / sum **980ms**)
- **measured baseline:** Fixed sleeps at L179/188/207/229/277/351/382/437 (40–400ms). Script is manual/deep playtest tooling, not CI e2e.
- **acceptance criteria:** Fixed sleeps → condition waits (status text / clickable / winner / modal) preserving playtest success criteria and artifact paths; no `src/` edits; Hex Hard / history-cap untouched.
- **verification commands:** `rg -n 'waitForTimeout' scripts/ramrod-deep-playtest.mjs` ; `node --check scripts/ramrod-deep-playtest.mjs`
- **conflict notes:** not an e2e harness shard; no ratchet JSON.

### q-mp-804 · Scripts: replace fixed `waitForTimeout` in `sum-dominoes-deep-playtest` (keep playtest outcomes)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none (leave `#1116`/`749` **e2e** `sum-dominoes-deep.spec.ts` alone with `contained` — different file)
- **series:** script-hygiene
- **verdict:** **SAFE** — non-src `scripts/` playtest; **not** the e2e spec owned by `749`
- **target files:** `scripts/sum-dominoes-deep-playtest.mjs` (**6** sites / sum **1050ms**)
- **measured baseline:** Fixed sleeps at L115/129/140/170/237/264. Script already has `waitForHumanOrEnd` for some gates — remaining sleeps are settle/retry pads.
- **acceptance criteria:** Fixed sleeps → condition waits; playtest contracts preserved; no `src/` / e2e spec edits in this ticket.
- **verification commands:** `rg -n 'waitForTimeout' scripts/sum-dominoes-deep-playtest.mjs` ; `node --check scripts/sum-dominoes-deep-playtest.mjs` ; `rg -n 'waitForTimeout' tests/e2e/sum-dominoes-deep.spec.ts` (leave e2e to `749`)
- **conflict notes:** leave `#1116`/`749` e2e alone.

### q-mp-805 · Scripts: replace fixed `waitForTimeout` in `render-perf-mode` (keep measure contracts)

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** script-hygiene
- **verdict:** **SAFE** — non-src perf helper script; prefer rAF / selector readiness already partially present (`waitDoubleRaf` / `measureTTI`)
- **target files:** `scripts/render-perf-mode.mjs` (**5** sites / sum **356ms**)
- **measured baseline:** L152 (16ms) + four 80–100ms pads in move-cost path; file already exports `waitDoubleRaf` / loading waits.
- **acceptance criteria:** Fixed sleeps replaced with rAF / condition waits without changing reported metric meanings; no `src/` edits; no AI timing asserts.
- **verification commands:** `rg -n 'waitForTimeout' scripts/render-perf-mode.mjs` ; `node --check scripts/render-perf-mode.mjs`
- **conflict notes:** none.

### q-mp-806 · Scripts: replace fixed `waitForTimeout` in `calla-deep-playtest` — [HOLD-CHECK: AI-turn adjacency]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** script-hygiene
- **verdict:** **HOLD-CHECK** — waits sit on “AI / render / thinking” branches; tests-only script harden under tip-owner guardrail; **no** Calla AI / rules / scoring edits; **no** fake-clock product retargets
- **target files:** `scripts/calla-deep-playtest.mjs` (**2** sites / sum **850ms** @ L164/174)
- **measured baseline:** Sleeps when `.calla-pit-valid` count is 0 while waiting for thinking/win/tie status.
- **acceptance criteria:** Prefer waiting on status `/thinking|win|tie/i` / valid-pit count / winner banner; playtest outcomes preserved; no `src/` AI edits.
- **verification commands:** `rg -n 'waitForTimeout' scripts/calla-deep-playtest.mjs` ; `node --check scripts/calla-deep-playtest.mjs`
- **conflict notes:** tip-owner review for AI-adjacency; no ratchet JSON.

### q-mp-807 · Scripts: replace fixed `waitForTimeout` in `par-55-deep-playtest` — [HOLD-CHECK: AI-delay adjacency]

- **repo:** `fuzzywigg/math-pentathlon`
- **priority:** P3 tooling
- **role:** worker
- **base:** `{MP_TIP}` (`cursor/mp-tip-post1059`)
- **depends-on:** none
- **series:** script-hygiene
- **verdict:** **HOLD-CHECK** — includes `waitForTimeout(900) // longer than old 800ms AI delay`; script-only condition waits under tip-owner guardrail; **do not** change AI delay constants or product timing; **no** `src/games/par-55/**` edits
- **target files:** `scripts/par-55-deep-playtest.mjs` (**5** sites / sum **1460ms**)
- **measured baseline:** L182/260/272/357/418; L272 explicitly pads past historical AI delay.
- **acceptance criteria:** Replace sleeps with waits on status / hand clickable / history / non-thinking human gate **without** encoding a new AI timing budget; playtest checks preserved; Hex Hard untouched.
- **verification commands:** `rg -n 'waitForTimeout|AI delay' scripts/par-55-deep-playtest.mjs` ; `node --check scripts/par-55-deep-playtest.mjs`
- **conflict notes:** tip-owner review; leave Stars & Bars / Hex Hard alone.

---

## Id allocation

New ids in this doc: **`q-mp-792` … `q-mp-807`** (**16** tasks — fewer than 25; no filler).  
Ids `q-mp-780`…`q-mp-791` are intentionally unused in this refill (gap after round-28 `767`…`779`).  
Do **not** reuse `q-mp-001`–`q-mp-779`. Tip-owner refill should point workers at these after folding this doc into `cursor/mp-tip-post1059`.

**Ceiling keys used in this refill:** **none** (tooling probe fix only; no product clears).  
**Not used here (already claimed / undrafted / HOLD / no headroom / prompt-skipped families):** void/nnnull/nullish successors, eqeqeq product clear (`#995`/`543`), optional-chain product clears, knip demote / unusedTypes baseline drop, wiki count remasure (`#1098`/`667`–`668`), tip-name stamps, UI coverage rounds, soft-fail characterizations, mutation-audit waves, board-3d **src** / **mp3d e2e** (`772`–`778`), harness shards, demo coverage, `*types*` residuals, Queens & Guards product, open post1059 workers `#1084`–`#1121`, round-28 wiki/`waitForGameReady`/`startHuman`/`#658` (`767`–`771`/`779`).

**Skipped after measurement (not filler):** stars-bars / memory-leak / nav-away script waits (HOLD families already dense in round-28); AI unit-wall speedups; knip unusedExports (LEAVE only); non-AI isolate files without proven non-shard speedup.

Prefer parallel start on: **794**–**799**, **802**–**807**. Serialize **792**→**793**; serialize **801** with `#1121`/`770`/`771`; serialize **800** lightly with **799**.

**One-line id tags:** `792 SAFE`, `793 SAFE`, `794 SAFE`, `795 SAFE`, `796 SAFE`, `797 SAFE`, `798 SAFE`, `799 SAFE`, `800 SAFE`, `801 SAFE`, `802 SAFE`, `803 SAFE`, `804 SAFE`, `805 SAFE`, `806 HOLD-CHECK`, `807 HOLD-CHECK`.

**Next action: fold into tip by the tip owner.**
