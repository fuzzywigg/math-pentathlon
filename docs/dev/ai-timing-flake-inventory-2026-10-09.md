# AI-timing unit flake inventory (2026-10-09)

**Task id:** `q-mp-151`  
**Role:** worker (report-only)  
**Tip audited:** `cursor/mp-tip-post598` @ `baccd195` (cut from `alpha` `7922f9af` after tip #598)  
**Scope:** Documentation only — inventory of overnight Oct 9 unit flakes that failed then passed on retrigger. **No** test, AI, rules, workflow, or Hex Hard **450ms** edits.

## Explicit HOLD (workers)

| Pin | Live tip citation |
| --- | --- |
| Hex Hard deadline | `src/games/hex/ai.ts` — `hard: 450` |
| Unit assert | `tests/unit/ai-hard-midgame-identity.test.ts` — `expect(HEX_MS.hard).toBeLessThanOrEqual(450)` |
| Midgame Hard flag (local bench) | `tests/unit/ai-move-time-midgame.bench.test.ts` — `HARD_FLAG_MS = 500` (local report; not a CI gate) |

Do **not** change AI search / scoring / difficulty / timing, loosen thresholds, or raise Hex Hard above **450ms**. Proposed fixes below are **TEST-HARNESS-only**.

## Sibling / duplicate check

| Draft / doc | Topic | Overlap |
| --- | --- | --- |
| [#693](https://github.com/fuzzywigg/math-pentathlon/pull/693) `q-mp-165` — [`ai-timing-ci-skip-inventory-2026-10-09.md`](./ai-timing-ci-skip-inventory-2026-10-09.md) | Why AI latency / move-time benches use `describe.skipIf(!!process.env.CI)` + tip unit budget | **Sibling.** #693 owns the **CI skip gate**. This doc owns **flake history / rates / harness-only fixes**. |
| [#704](https://github.com/fuzzywigg/math-pentathlon/pull/704) `q-mp-151` on base `cursor/mp-tip-post477` | Same inventory filename; wrong tip base for post-#598 stacking | **Superseded** by this tip-`post598` draft (comment on #704). Coverage-cluster rates from #704 are folded in below. |
| [`docs/flake-rate-wave5-2026-10-08.md`](../flake-rate-wave5-2026-10-08.md) §2 | Earlier midgame Hard p95 flag under shuffle | Background; not the Oct 9 overnight cohort |
| Open draft [#642](https://github.com/fuzzywigg/math-pentathlon/pull/642) `q-mp-117` | `ui-helper-dedupe` generation-timeout isolation | Orthogonal (fake timers / isolate), not AI timing |

## Method

### CI evidence (overnight Oct 9)

Pulled failed `unit` job logs via `gh run view <id> --log-failed` for tip drafts that failed then passed on retrigger. Tip fold commits on `#598` also name several flakes in `chore(ci): retrigger…` messages.

| PR | Failed run | Later green | Failure |
| --- | --- | --- | --- |
| [#653](https://github.com/fuzzywigg/math-pentathlon/pull/653) | [37912085506](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37912085506) | [37913429730](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37913429730) | queens-guards calibration assertion |
| [#660](https://github.com/fuzzywigg/math-pentathlon/pull/660) | [37917221302](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37917221302) | [37918372927](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37918372927) / [37920273961](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37920273961) | queens-guards determinism 180s timeout |
| [#656](https://github.com/fuzzywigg/math-pentathlon/pull/656) | [37914694241](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37914694241), [37915670722](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37915670722), [37917768014](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37917768014) | later green | det timeout → pent hook → calibration (successive SHAs) |
| [#652](https://github.com/fuzzywigg/math-pentathlon/pull/652) | [37911853866](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37911853866) | [37913696783](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37913696783) | pent-em-in `beforeAll` hook 30s timeout |
| [#598](https://github.com/fuzzywigg/math-pentathlon/pull/598) fold batch 4 | [37935929443](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37935929443) | [37937064626](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37937064626) (`66b683a5` retrigger) | queens-guards shard-d determinism 180s (7th overnight flake) |
| [#632](https://github.com/fuzzywigg/math-pentathlon/pull/632) / [#662](https://github.com/fuzzywigg/math-pentathlon/pull/662) | GHA `unit` green (`CI=1` skips midgame bench — see [#693](https://github.com/fuzzywigg/math-pentathlon/pull/693)) | — | Local `npm run test:unit:coverage` verification: fab quality timeout + fab/fiar `hardFlags` |

Earlier same-day signatures: determinism timeout [#629](https://github.com/fuzzywigg/math-pentathlon/pull/629) [37886254762](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37886254762); pent hook [#639](https://github.com/fuzzywigg/math-pentathlon/pull/639) [37893377717](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37893377717).

### Local rates (N≥20)

Host: 4-vCPU cloud agent. Two measurement passes:

| Cohort | Command / load shape | N | Failures | Source |
| --- | --- | --- | --- | --- |
| **A — unit-node under unit-shared contention** | `CI=1 npx vitest run --project unit-node` + background `unit-shared` | **22** | **0** | this agent (`/opt/cursor/artifacts/q-mp-151-flake/unit-node-under-load-summary.tsv`) |
| **B — midgame under AI-core contention** | `env -u CI` midgame bench + background shard-a/d + calibration | **22** | **0** | this agent |
| **C — fab quality under AI contention** | `CI=1` shard-a `-t fab-a-diffy` + background shard-c/d + calibration | **22** | **0** | this agent |
| **D — full suite supplemental** | `CI=1 npm run test:unit` | **5** | **0** | this agent (~160s wall; GHA failing runs were ~360–390s) |
| **F — coverage cluster (no `CI`)** | `npx vitest run --coverage` shards a/c/d/e + calibration + midgame bench | **20** | **20/20** hardFlags; **1/20** fab quality timeout | folded from [#704](https://github.com/fuzzywigg/math-pentathlon/pull/704) (`/opt/cursor/artifacts/ai-timing-flake/`) |

Coverage-cluster flag histogram (#704): `fab-a-diffy` 20/20, `fiar` 20/20, `queens-guards` 20/20 (excluded from `hardFlags` expect), `pent-em-in` 1/20.

**Honesty note:** Cohorts A–D did not reproduce GHA timeouts on this faster host. Cohort **F** (coverage instrumentation + no `CI`) is the reliable local repro for #632/#662. CI job URLs remain primary evidence for calibration / shard-d / shard-c.

---

## Inventory

### 1. queens-guards AI calibration win-rate assert — #653 (+ #656)

| Field | Value |
| --- | --- |
| **File / test** | `tests/unit/ai-calibration-difficulty-order.test.ts` → `AI calibration — Hard >= Easy win rate vs random` → **`queens-guards: Hard win rate >= Easy on seeded sample`** |
| **Failure mode** | **AssertionError** (not a Vitest timeout): `queens-guards: Easy=100.0% Hard=75.0% (n=4): expected 0.75 to be greater than or equal to 1` at `:68`. Case budget **90_000ms**; `CALIBRATION_DEADLINE_MS=120` truncates Hard search under contention so Hard can lose to Easy on tiny `n=4`. |
| **CI evidence** | [#653](https://github.com/fuzzywigg/math-pentathlon/pull/653) [37912085506](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37912085506) → green [37913429730](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37913429730); also [#656](https://github.com/fuzzywigg/math-pentathlon/pull/656) [37917768014](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37917768014). Tip commits `f23bce77` / `97bdac3d` name the calibration flake. |
| **Local rate** | **0 / 22** (cohort A); #704 also **0/20–25** under burn/competitor |
| **Harness-only fix** | Prefer file/case vitest **`retry: 1–2` under `CI`**, or bump queens-guards sample `games` (4→8) for variance only. Alternate: isolate calibration file / single-worker pool so deadline truncation is not contended. **Do not** add queens-guards to `KNOWN_TIP_INVERSIONS` without tip-owner sign-off. **Do not** raise `deadlineMs` / edit `ai.ts`. |

### 2. queens-guards determinism timeout (shard-d) — #660 (+ #656 / #629)

| Field | Value |
| --- | --- |
| **File / test** | `tests/unit/ai-determinism-shard-d.test.ts` → **`queens-guards`** → **`determinism: fixed seed → same move on 50 mid-game states × difficulties`** (`ai-determinism-harness.ts` `it(..., 180_000)`) |
| **Failure mode** | **Test timed out in 180000ms**. CI pass timings for the same case often sit at **~130–160s**, so 180s has thin headroom on GHA when peer shards contend. |
| **CI evidence** | [#660](https://github.com/fuzzywigg/math-pentathlon/pull/660) [37917221302](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37917221302); [#656](https://github.com/fuzzywigg/math-pentathlon/pull/656) [37914694241](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37914694241); [#629](https://github.com/fuzzywigg/math-pentathlon/pull/629) [37886254762](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37886254762). Retriggers green (`f6723b3c`, `3c1a9243`, …). |
| **Local rate** | **0 / 22** (cohort A); #704 **0/20** (~65–69s locally) |
| **Harness-only fix** | (1) **CI-only longer case timeout** (e.g. 180s → 300s); (2) vitest **`retry: 1`** on shard-d; (3) optional **separate pool / `maxWorkers: 1`** for shard-d. Prefer (1)+(2). No AI deadline / depth changes. |

### 3. fab-a-diffy quality timeout + midgame/fiar hardFlags — #632 / #662 (`test:unit:coverage`)

CI `unit` stays green because midgame is skipped when `CI=1` ([#693](https://github.com/fuzzywigg/math-pentathlon/pull/693)). Failures are on the **coverage / no-CI** path.

#### 3a. fab-a-diffy quality timeout (shard-a)

| Field | Value |
| --- | --- |
| **File / test** | `tests/unit/ai-determinism-shard-a.test.ts` → **`fab-a-diffy` > `quality: easy/medium differ from hard vs oracle`** |
| **Failure mode** | **Test timed out in 180000ms** under V8 coverage + parallel AI benches. |
| **Evidence** | [#632](https://github.com/fuzzywigg/math-pentathlon/pull/632) PR body; coverage-cluster **1/20** (#704) |
| **Local rate** | **1 / 20** under coverage cluster (F); **0 / 22** without coverage (C) |
| **Harness-only fix** | Coverage-aware longer timeout / **`retry: 1`** on shard-a / separate pool without the move-time bench. Do not retune fab AI. |

#### 3b. midgame hardFlags (fab-a-diffy / fiar)

| Field | Value |
| --- | --- |
| **File / test** | `tests/unit/ai-move-time-midgame.bench.test.ts` → `expect(hardFlags).toEqual([])` (`HARD_FLAG_MS = 500`; queens-guards already excluded) |
| **Failure mode** | Wall-clock **p95 > 500ms** on Hard under coverage / full-suite contention → non-empty `hardFlags`. Already **`describe.skipIf(!!process.env.CI)`**. |
| **Evidence** | [#632](https://github.com/fuzzywigg/math-pentathlon/pull/632) / [#662](https://github.com/fuzzywigg/math-pentathlon/pull/662) PR bodies; coverage-cluster **20/20** (#704) |
| **Local rate** | **20 / 20** under coverage cluster (F); **0 / 22** under AI-core-only stress (B) |
| **Harness-only fix** | Keep `HARD_FLAG_MS = 500` and CI skip. Make the strict assert apply only when `AI_BENCH_STRICT=1` or the file is the sole vitest target; under coverage / full-suite keep **report-only** (still write the markdown). Or `skipIf` when coverage is active. Matches [`docs/flake-rate-wave5-2026-10-08.md`](../flake-rate-wave5-2026-10-08.md) §2. **Do not** raise 500ms or Hex 450ms. |

### 4. pent-em-in shard-c hook timeout — #652 (+ #656 / #639)

| Field | Value |
| --- | --- |
| **File / test** | `tests/unit/ai-determinism-shard-c.test.ts` → **`pent-em-in`** → `beforeAll` in `describeHarness` (`ai-determinism-harness.ts:69`, `collectStates`) |
| **Failure mode** | **Hook timed out in 30000ms** (project default `hookTimeout: 30_000`). Midgame fixture build exceeds 30s under full-suite load. |
| **CI evidence** | [#652](https://github.com/fuzzywigg/math-pentathlon/pull/652) [37911853866](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37911853866) → green [37913696783](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37913696783); also [#656](https://github.com/fuzzywigg/math-pentathlon/pull/656) / [#639](https://github.com/fuzzywigg/math-pentathlon/pull/639). |
| **Local rate** | **0 / 22** (cohort A); #704 **0/20** |
| **Harness-only fix** | Raise **`hookTimeout` only for AI determinism shards** (e.g. 120_000) via dedicated project / per-file config — **not** a global suite-wide raise. Alternate: `retry: 1` on shard-c; or precompute midgame fixtures. |

### 5. queens-guards shard-d determinism timeout — tip #598 fold batch 4 (7th flake)

| Field | Value |
| --- | --- |
| **File / test** | Same as §2: `tests/unit/ai-determinism-shard-d.test.ts` → **`queens-guards` > determinism…** |
| **Failure mode** | **Test timed out in 180000ms** (identical mode to #660) |
| **CI evidence** | [#598](https://github.com/fuzzywigg/math-pentathlon/pull/598) [37935929443](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37935929443) → green [37937064626](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37937064626); tip commit `66b683a5` “retrigger after ai-determinism-shard-d queens-guards timeout flake”. Suite Duration **391.44s**; `1 failed / 3123 passed / 2 skipped`. |
| **Local rate** | Same as §2 (**0 / 22** cohort A) |
| **Harness-only fix** | Same as §2 — one harness change covers #660 and #598. |

---

## Summary table

| # | Sighting | Test | Mode | CI fail→pass | Local fails / N |
| --- | --- | --- | --- | --- | --- |
| 1 | #653 / #656 | `ai-calibration-difficulty-order` · queens-guards Hard≥Easy | AssertionError (n=4 under deadline) | yes | 0 / 22 (A) |
| 2 | #660 / #656 / #629 | `ai-determinism-shard-d` · queens-guards determinism | test timeout 180s | yes | 0 / 22 (A) |
| 3a | #632 coverage | `ai-determinism-shard-a` · fab-a-diffy quality | test timeout 180s | n/a (local coverage) | **1 / 20** (F) |
| 3b | #632 / #662 coverage | `ai-move-time-midgame.bench` · hardFlags | p95 > 500ms assert | n/a (skipped in CI) | **20 / 20** (F) |
| 4 | #652 / #656 / #639 | `ai-determinism-shard-c` · pent-em-in `beforeAll` | hook timeout 30s | yes | 0 / 22 (A) |
| 5 | #598 batch 4 | `ai-determinism-shard-d` · queens-guards determinism | test timeout 180s | yes | 0 / 22 (A) |

## Recommended harness backlog (tip-owner fold order)

1. **shard-d / queens-guards determinism** — CI-only longer case timeout + file `retry` (§2 / §5). Highest CI retrigger frequency overnight.  
2. **midgame hardFlags under coverage** — soft assert / `AI_BENCH_STRICT` / coverage skip (§3b); keep CI skip per [#693](https://github.com/fuzzywigg/math-pentathlon/pull/693).  
3. **shard-c hookTimeout** for determinism `beforeAll` (§4).  
4. **calibration queens-guards** — file `retry` or larger seeded `games` (§1); no AI retune.  
5. **shard-a fab quality under coverage** — retry or coverage-aware timeout (§3a).

## What this task must not do

- Edit `*/ai.ts` search, scoring, difficulty, or play deadlines (Hex Hard stays **450ms**).  
- Loosen `HARD_FLAG_MS` / remove Hard≥Easy guards without tip-owner HOLD.  
- Remove `describe.skipIf(!!process.env.CI)` from AI benches to “fix” CI (see [#693](https://github.com/fuzzywigg/math-pentathlon/pull/693)).  
- Change `*/rules.ts` legal-move / scoring paths or Stars & Bars history cap.  
- Raise global Vitest / CI job timeouts for the whole suite.

## Verification (this task)

```bash
npm run check:dev-docs
# Local stress summaries: /opt/cursor/artifacts/q-mp-151-flake/*-summary.tsv
# Coverage-cluster rates folded from #704 artifacts under /opt/cursor/artifacts/ai-timing-flake/
```
