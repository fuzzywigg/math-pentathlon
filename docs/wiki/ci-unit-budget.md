# CI unit job budget + AI-bench skips

**Task id:** `q-mp-289` (wall-budget remeasure; prior `q-mp-233` / `q-mp-175`)  
**Scope:** Docs / visuals only — no workflow edits, no AI timing or product changes.  
**Tip at authoring:** `cursor/mp-tip-post755` @ `89e40ad7` (full SHA `89e40ad7e0c3d058725cebd3b871425148ead60b`). Wall-budget + AI-bench CI evidence cites green tip-PR unit job [`37999819714`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37999819714) (PR [#801](https://github.com/fuzzywigg/math-pentathlon/pull/801) → tip; tip-branch unit jobs were cancelled by tip-fold pushes). Older post728 wall draft [#746](https://github.com/fuzzywigg/math-pentathlon/pull/746) left open as **contained**.

Short contributor page for the **unit** job wall budget and why the two AI latency benches stay skipped when `CI=1`. Orthogonal to the blocking-vs-report-only job graph in [`docs/dev/ci-gates-mermaid-q-mp-073.md`](../dev/ci-gates-mermaid-q-mp-073.md). Full CI-skip inventory + HOLD citations: [`docs/dev/ai-timing-ci-skip-inventory-2026-10-09.md`](../dev/ai-timing-ci-skip-inventory-2026-10-09.md). Layer file/case tables: [`docs/dev/testing-layers-2026-10-09.md`](../dev/testing-layers-2026-10-09.md) (`q-mp-260` / open [#791](https://github.com/fuzzywigg/math-pentathlon/pull/791) / backlog `q-mp-285`); this page owns the **unit wall budget** + AI-bench skip evidence only.

## Hard-rule HOLD (AI timing)

Workers must **not** change AI timing asserts, deadlines, search, scoring, or difficulty.

| Rule                                    | Live tip pin                                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Hex Hard play deadline stays **450ms**  | `src/games/hex/ai.ts` — `hard: 450`                                                            |
| Unit characterization of that pin       | `tests/unit/ai-hard-midgame-identity.test.ts` — `expect(HEX_MS.hard).toBeLessThanOrEqual(450)` |
| Do not enable the two AI benches on GHA | Keep `describe.skipIf(!!process.env.CI)` on the files below                                    |
| CI permissions stay read-only           | `permissions: contents: read` + `persist-credentials: false` on checkout                       |

Do **not** “fix” Hex Hard by raising the deadline above 450ms. Do **not** remove the CI skips to chase coverage on shared runners.

## Unit job time budget (live `ci.yml`)

From `.github/workflows/ci.yml` `unit` job (re-read on tip `89e40ad7`; knobs unchanged):

| Knob         | Value                                |
| ------------ | ------------------------------------ |
| Target wall  | ~**8 min** (job comment + step echo) |
| Step timeout | **12m** (`Run unit tests`)           |
| Job timeout  | **14m**                              |

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
    observed["tip-PR CI 37999819714<br/>Duration 348.43s ≈ 5.8 min"]
    slack["~2.2 min slack before 12m step"]
    target --- observed --- slack
  end

  subgraph skip ["skipped when CI=1"]
    t["tablet-ai-hard-latency.bench<br/>10 tests skipped"]
    m["ai-move-time-midgame.bench<br/>1 test skipped"]
  end

  step --> budget
  step -.->|describe.skipIf CI| skip
```

## Live suite size (tip `89e40ad7`)

Wall evidence below is from tip-PR run [`37999819714`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37999819714) at **3163** files / Vitest Duration **348.43s**. Live tip HEAD suite (remeasured at authoring) is one file larger; count-table ownership for testing-layers stays with open [#791](https://github.com/fuzzywigg/math-pentathlon/pull/791) / `q-mp-285`.

| Metric                                      |                                                                                Count | How                                                                                                               |
| ------------------------------------------- | -----------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------- |
| Unit files (excl. `_tokenmaxx_archive`)     |                                                                             **3164** | `find tests/unit … \| wc -l` on tip `89e40ad7`                                                                    |
| Cases listed                                |                                                                            **12347** | `npx vitest list \| wc -l` on tip `89e40ad7`                                                                      |
| Tip-PR CI run summary (`#801` @ `cb8e7e14`) | **3161** passed / **2** skipped files; **12318** passed / **44** skipped (**12362**) | run [`37999819714`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37999819714) — Duration **348.43s** |

Vitest `list` counts and the GHA summary totals differ slightly (list includes entries that resolve differently at run time); file/case rows are tip-live. Prior post728 wall cite was Duration **298.65s** ≈ 5.0 min at **3140** files (run [`37972882883`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37972882883)).

## Two AI benches skipped under `CI=1`

| File                                              | Gate                                | Tip-PR CI evidence (run [`37999819714`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/37999819714)) |
| ------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `tests/unit/tablet-ai-hard-latency.bench.test.ts` | `describe.skipIf(!!process.env.CI)` | `(10 tests \| 10 skipped)`                                                                                      |
| `tests/unit/ai-move-time-midgame.bench.test.ts`   | `describe.skipIf(!!process.env.CI)` | `(1 test \| 1 skipped)`                                                                                         |

Together they are the **2 skipped test files** in that run’s summary: `Test Files 3161 passed | 2 skipped (3163)`.

### Screenshot / log twins (real tip CI)

![Tip CI unit job: budget echo, both AI benches skipped (pattern; older run 37932241420)](../screenshots/ci/tip-unit-ai-benches-skipped-37932241420.png)

Plain-text twin of the **post755 tip-PR** GHA lines (ANSI stripped): [`docs/screenshots/ci/tip-unit-ai-benches-skipped-37999819714.txt`](../screenshots/ci/tip-unit-ai-benches-skipped-37999819714.txt) — `unit suite: 3163 files`, both benches skipped, `Duration 348.43s`.

Historical post728 twin (left for comparison): [`docs/screenshots/ci/tip-unit-ai-benches-skipped-37972882883.txt`](../screenshots/ci/tip-unit-ai-benches-skipped-37972882883.txt).

Local skip smoke (same two files under `CI=1`, not the full suite): [`docs/screenshots/ci/local-CI1-ai-benches-skip-smoke.txt`](../screenshots/ci/local-CI1-ai-benches-skip-smoke.txt).

```bash
CI=1 npx vitest run --project unit-isolated tests/unit/tablet-ai-hard-latency.bench.test.ts
CI=1 npx vitest run --project unit-shared tests/unit/ai-move-time-midgame.bench.test.ts
```

## Related

- Public CI posture: [Development — CI posture](./development.md#ci-posture-public) · unit runtime note in that page
- Testing-layer counts (file/case tables): [`docs/dev/testing-layers-2026-10-09.md`](../dev/testing-layers-2026-10-09.md) (`q-mp-260` / `q-mp-285`; open [#791](https://github.com/fuzzywigg/math-pentathlon/pull/791) / [#767](https://github.com/fuzzywigg/math-pentathlon/pull/767) / [#732](https://github.com/fuzzywigg/math-pentathlon/pull/732) left open as contained)
- AI-timing CI-skip inventory + HOLD detail: [`docs/dev/ai-timing-ci-skip-inventory-2026-10-09.md`](../dev/ai-timing-ci-skip-inventory-2026-10-09.md)
- Blocking vs report-only Mermaid: [`docs/dev/ci-gates-mermaid-q-mp-073.md`](../dev/ci-gates-mermaid-q-mp-073.md)
- Prior authoring pointer: [`docs/dev/ci-unit-budget-q-mp-175.md`](../dev/ci-unit-budget-q-mp-175.md)
