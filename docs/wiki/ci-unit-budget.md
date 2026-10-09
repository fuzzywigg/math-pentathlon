# CI unit job budget + AI-bench skips

**Task id:** `q-mp-233` (refresh of `q-mp-175`)  
**Scope:** Docs / visuals only — no workflow edits, no AI timing or product changes.  
**Tip at authoring:** `cursor/mp-tip-post728` @ `b5884207` (full SHA `b5884207c41d10fa3fa7aa1ee01ec80c9bb61b4d`).

Short contributor page for the **unit** job wall budget and why the two AI latency benches stay skipped when `CI=1`. Orthogonal to the blocking-vs-report-only job graph in [`docs/dev/ci-gates-mermaid-q-mp-073.md`](../dev/ci-gates-mermaid-q-mp-073.md). Full CI-skip inventory + HOLD citations: [`docs/dev/ai-timing-ci-skip-inventory-2026-10-09.md`](../dev/ai-timing-ci-skip-inventory-2026-10-09.md). Layer file/case tables: open draft [#732](https://github.com/fuzzywigg/math-pentathlon/pull/732) (`q-mp-199` → `docs/dev/testing-layers-2026-10-09.md`); this page owns the **unit wall budget** + AI-bench skip evidence only.

## Hard-rule HOLD (AI timing)

Workers must **not** change AI timing asserts, deadlines, search, scoring, or difficulty.

| Rule | Live tip pin |
| --- | --- |
| Hex Hard play deadline stays **450ms** | `src/games/hex/ai.ts` — `hard: 450` |
| Unit characterization of that pin | `tests/unit/ai-hard-midgame-identity.test.ts` — `expect(HEX_MS.hard).toBeLessThanOrEqual(450)` |
| Do not enable the two AI benches on GHA | Keep `describe.skipIf(!!process.env.CI)` on the files below |
| CI permissions stay read-only | `permissions: contents: read` + `persist-credentials: false` on checkout |

Do **not** “fix” Hex Hard by raising the deadline above 450ms. Do **not** remove the CI skips to chase coverage on shared runners.

## Unit job time budget (live `ci.yml`)

From `.github/workflows/ci.yml` `unit` job (re-read on tip `b5884207`):

| Knob | Value |
| --- | --- |
| Target wall | ~**8 min** (job comment + step echo) |
| Step timeout | **12m** (`Run unit tests`) |
| Job timeout | **14m** |

```mermaid
flowchart TB
  subgraph job ["unit job — timeout-minutes: 14"]
    co["checkout<br/>persist-credentials: false"]
    ci["npm ci"]
    step["Run unit tests<br/>timeout-minutes: 12"]
    co --> ci --> step
  end

  subgraph budget ["wall budget"]
    target["target ~8 min"]
    observed["tip CI 37972882883<br/>Duration 298.65s ≈ 5.0 min"]
    slack["~3 min slack before 12m step"]
    target --- observed --- slack
  end

  subgraph skip ["skipped when CI=1"]
    t["tablet-ai-hard-latency.bench<br/>10 tests skipped"]
    m["ai-move-time-midgame.bench<br/>1 test skipped"]
  end

  step --> budget
  step -.->|describe.skipIf CI| skip
```

## Live suite size (tip `b5884207`)

Re-measured on the tip tree (same formulas CI / `#732` use):

| Metric | Count | How |
| --- | ---: | --- |
| Unit files (excl. `_tokenmaxx_archive`) | **3140** | `find tests/unit … \| wc -l` (matches CI echo) |
| Cases listed | **12154** | `npx vitest list \| wc -l` |
| Tip CI run summary | **3138** passed / **2** skipped files; **12142** passed / **42** skipped / **1** todo (**12185**) | run [`37972882883`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37972882883) |

Vitest `list` counts and the GHA summary totals differ slightly (list includes entries that resolve differently at run time); both are tip-live.

## Two AI benches skipped under `CI=1`

| File | Gate | Tip CI evidence (run [`37972882883`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37972882883)) |
| --- | --- | --- |
| `tests/unit/tablet-ai-hard-latency.bench.test.ts` | `describe.skipIf(!!process.env.CI)` | `(10 tests \| 10 skipped)` |
| `tests/unit/ai-move-time-midgame.bench.test.ts` | `describe.skipIf(!!process.env.CI)` | `(1 test \| 1 skipped)` |

Together they are the **2 skipped test files** in that run’s summary: `Test Files 3138 passed | 2 skipped (3140)`.

### Screenshot / log twins (real tip CI)

![Tip CI unit job: budget echo, both AI benches skipped (pattern; older run 37932241420)](../screenshots/ci/tip-unit-ai-benches-skipped-37932241420.png)

Plain-text twin of the **live tip** GHA lines (ANSI stripped): [`docs/screenshots/ci/tip-unit-ai-benches-skipped-37972882883.txt`](../screenshots/ci/tip-unit-ai-benches-skipped-37972882883.txt) — `unit suite: 3140 files`, both benches skipped, `Duration 298.65s`.

Local skip smoke (same two files under `CI=1`, not the full suite): [`docs/screenshots/ci/local-CI1-ai-benches-skip-smoke.txt`](../screenshots/ci/local-CI1-ai-benches-skip-smoke.txt).

```bash
CI=1 npx vitest run --project unit-isolated tests/unit/tablet-ai-hard-latency.bench.test.ts
CI=1 npx vitest run --project unit-shared tests/unit/ai-move-time-midgame.bench.test.ts
```

## Related

- Public CI posture: [Development — CI posture](./development.md#ci-posture-public) · unit runtime note in that page
- Testing-layer counts (file/case tables): open draft [#732](https://github.com/fuzzywigg/math-pentathlon/pull/732) / [`docs/dev/testing-layers-2026-10-09.md`](../dev/testing-layers-2026-10-09.md)
- AI-timing CI-skip inventory + HOLD detail: [`docs/dev/ai-timing-ci-skip-inventory-2026-10-09.md`](../dev/ai-timing-ci-skip-inventory-2026-10-09.md)
- Blocking vs report-only Mermaid: [`docs/dev/ci-gates-mermaid-q-mp-073.md`](../dev/ci-gates-mermaid-q-mp-073.md)
- Prior authoring pointer: [`docs/dev/ci-unit-budget-q-mp-175.md`](../dev/ci-unit-budget-q-mp-175.md)
