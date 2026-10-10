# q-mp-496 — CI unit wall-budget / test-speed remeasure (tip post914, 2026-10-10)

**Task id:** `q-mp-496`  
**Role:** worker (docs / json / svg only)  
**Tip audited:** `cursor/mp-tip-post914` @ `5c5101f5` (full `5c5101f59422d8b9f9142c7a6852b5d9d148e5f9`)  
**Wall evidence SHA:** `e43a25d2` (latest **successful** tip-fold unit job; suite **3242** — tip then grew to **3245**)  
**Measured at:** `2026-10-10T10:02:00Z` (UTC)  
**Machine summary:** [`ci-unit-wall-budget-post914-2026-10-10.json`](./ci-unit-wall-budget-post914-2026-10-10.json)  
**Chart:** [`ci-unit-wall-budget-post914-2026-10-10.svg`](./ci-unit-wall-budget-post914-2026-10-10.svg)  
**Scope:** Dated **wall-budget / test-speed** stamp. **No `src/` edits. No test-behavior edits. No CI workflow edits. No wall raise.** Orthogonal to `#956` / `q-mp-460` (slowest **per-file** inventory).

## Purpose

Backlog `q-mp-496` (round 16 / `#955`) asked for a tip-post914 remeasure of the CI unit wall. Spec backlog stamped tip mid-fold at **3242** files / **~13070** cases; prior wall docs (`q-mp-446` / `#936`) stamped post898 at **3235** / **12988**. This PR re-measures the **live** tip (tip owner `#949` still folding) and records observed GHA Duration / job wall. **FLAG if unit wall > 420s** — **not raised** (primary tip Duration **357.17s** / job wall **378s**; max tip-PR Duration sample **369.71s** / job wall **391s**; same-size **3245**-file tip-PR sample Duration **346.42s**).

Canonical wiki page ownership stays with the `ci-unit-budget` series (`q-mp-446` / `#936` and earlier); this ticket ships a tip-stamped report trio only (constraint: docs/report/json/svg).

## Hard-rule HOLD (explicit)

| Rule                                                      | Live tip pin                                                            |
| --------------------------------------------------------- | ----------------------------------------------------------------------- |
| Hex Hard play deadline stays **450ms**                    | `src/games/hex/ai.ts` — `hard: 450`                                     |
| Do not enable the two AI benches on GHA                   | Keep `describe.skipIf(!!process.env.CI)`                                |
| Do **not** raise unit wall / step / job timeouts          | `ci.yml` unit: target ~**8 min**, step **12m**, job **14m** (unchanged) |
| CI permissions stay read-only                             | `permissions: contents: read` + `persist-credentials: false`            |
| No AI timing / search / scoring / difficulty / copy edits | HOLD                                                                    |

## Duplicate check (open drafts)

| Related draft / prior                                                                                                                               | Overlap                                       | Action                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------- |
| [#955](https://github.com/fuzzywigg/math-pentathlon/pull/955) `q-mp-090p`                                                                           | Defines this task; backlog only               | Leave open                                      |
| [#936](https://github.com/fuzzywigg/math-pentathlon/pull/936) `q-mp-446`                                                                            | Prior post898 wall stamp                      | Leave open as **contained**                     |
| [#887](https://github.com/fuzzywigg/math-pentathlon/pull/887) `q-mp-388` / [#843](https://github.com/fuzzywigg/math-pentathlon/pull/843) `q-mp-338` | Older tip wall stamps                         | Leave open as **contained**                     |
| [#956](https://github.com/fuzzywigg/math-pentathlon/pull/956) `q-mp-460`                                                                            | Slowest-unit **per-file** inventory (post914) | Leave open; wall cells stay here (do not dupe)  |
| Tip fold [#949](https://github.com/fuzzywigg/math-pentathlon/pull/949)                                                                              | Tip owner folding drafts into post914         | Tip head moves; this PR rebases onto latest tip |

No open draft into `cursor/mp-tip-post914` already owns a post914 unit **wall-budget** remeasure → full task proceeds.

## Method (live tip)

```text
$ git fetch origin cursor/mp-tip-post914 && git rev-parse HEAD
  5c5101f59422d8b9f9142c7a6852b5d9d148e5f9

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3245

$ npx vitest list | wc -l
  13100

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ CI=1 npx vitest run --project unit-isolated tests/unit/tablet-ai-hard-latency.bench.test.ts
  Test Files  1 skipped (1); Tests  10 skipped (10)

$ CI=1 npx vitest run --project unit-shared tests/unit/ai-move-time-midgame.bench.test.ts
  Test Files  1 skipped (1); Tests  1 skipped (1)
```

Primary tip wall cite: tip-fold run [`38041487792`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041487792) unit job @ `e43a25d2` (**3242** files) — Vitest Duration **357.17s**, unit job wall **378s**, Run-unit-tests step **358s**. Both AI benches skipped under `CI=1`. Later tip-fold runs on `b3f00cc9` / `5c5101f5` were cancelled by successive tip pushes before unit completed; suite on live tip HEAD is **3245** / **13100**.

## Before → after metrics

| Metric                     | Before (post898 `q-mp-446`) | Stale backlog (`q-mp-496`) |                 After (live tip `5c5101f5`) |
| -------------------------- | --------------------------: | -------------------------: | ------------------------------------------: |
| Unit files                 |                    **3235** |                   **3242** |                                    **3245** |
| Cases (`npx vitest list`)  |                   **12988** |                 **~13070** |                                   **13100** |
| Primary GHA Duration       | **199.97s** (`38038340938`) |                        n/a | **357.17s** tip unit (`38041487792` @ 3242) |
| Max tip-PR Duration sample |       **362.95s** (post898) |                        n/a |  **369.71s** (run `38041436773`, PR `#948`) |
| Primary tip unit job wall  |                    **215s** |                        n/a |                **378s** (run `38041487792`) |
| Max tip-PR unit job wall   |                    **384s** |                        n/a |                **391s** (run `38041436773`) |
| Same-size tip-PR (3245)    |                         n/a |                        n/a |     **346.42s** / **367s** wall (PR `#953`) |
| FLAG (>420s wall)          |                          no |                        n/a |                                      **no** |
| Budgets (`ci.yml`)         |          ~8 min / 12m / 14m |                  unchanged |            **unchanged** (no workflow edit) |
| Hex Hard                   |                   **450ms** |                  **450ms** |                         **450ms** untouched |

### GHA wall evidence table

| Run                                                                                    | Context                              | SHA        | Suite files | Vitest Duration | Unit job wall |
| -------------------------------------------------------------------------------------- | ------------------------------------ | ---------- | ----------: | --------------: | ------------: |
| [`38038340938`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38038340938) | post898 tip wall (before)            | `85522638` |        3235 |     **199.97s** |          215s |
| [`38041487792`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041487792) | **tip post914 unit (primary)**       | `e43a25d2` |        3242 |     **357.17s** |      **378s** |
| [`38041436773`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041436773) | tip-PR `#948` (max Duration / wall)  | `20b40143` |        3242 |     **369.71s** |          391s |
| [`38041352698`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041352698) | tip-PR `#947`                        | `55f890bb` |        3241 |     **367.02s** |          385s |
| [`38041947579`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041947579) | tip-PR `#956` (slowest-file sibling) | `c0fc5b61` |        3242 |     **363.38s** |          384s |
| [`38041745468`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041745468) | tip-PR `#945`                        | `ba22df2b` |        3243 |     **362.49s** |          381s |
| [`38041306409`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041306409) | tip-PR `#943`                        | `3d85b06f` |        3242 |     **355.85s** |          377s |
| [`38041502765`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041502765) | tip-PR `#950`                        | `659304d8` |        3243 |     **355.26s** |          373s |
| [`38041249766`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041249766) | tip-PR `#939`                        | `98c4657a` |        3241 |     **348.40s** |          371s |
| [`38041562697`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041562697) | tip-PR `#951`                        | `b3b15382` |        3243 |     **347.78s** |          368s |
| [`38041647999`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041647999) | tip-PR `#953` (3245-file sample)     | `e1d7f695` |    **3245** |     **346.42s** |          367s |
| [`38041828360`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041828360) | tip-PR `#955` (backlog)              | `b633a26e` |        3242 |     **345.84s** |          367s |
| [`38042149223`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38042149223) | tip-PR `#954`                        | `14b9681a` |        3243 |     **282.51s** |          303s |
| [`38041588497`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041588497) | tip-PR `#952` (fast sample)          | `8049c9d2` |        3243 |     **192.88s** |          211s |
| [`38041328961`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041328961) | tip-PR `#946` (fast sample)          | `0a96d74b` |        3242 |     **195.03s** |          212s |

Primary tip summary (`38041487792` @ `e43a25d2`): Test Files **3240** passed / **2** skipped (**3242**); Tests **13056** passed / **55** skipped (**13111**); both AI benches skipped under `CI=1`.

Local corroboration on wall-evidence SHA `e43a25d2` (`CI=1 npm run test:unit`): Duration **155.36s**; Test Files **3240** passed / **2** skipped (**3242**); Tests **13056** passed / **55** skipped (**13111**); `EXIT 0` (agent host; not the GHA wall cite).

## Budgets (unchanged)

From `.github/workflows/ci.yml` `unit` job (re-read on tip `5c5101f5`; knobs unchanged; **workflows not edited**):

| Knob                                               | Value        |
| -------------------------------------------------- | ------------ |
| Target wall                                        | ~**8 min**   |
| Step timeout                                       | **12m**      |
| Job timeout                                        | **14m**      |
| Slack before 12m step (primary tip Duration)       | ~**6.0 min** |
| Slack before 12m step (max tip-PR Duration sample) | ~**5.8 min** |

## FLAG assessment

- **Threshold:** unit wall **> 420s**
- **Primary tip Vitest Duration:** **357.17s**
- **Primary tip unit job wall:** **378s**
- **Max observed tip-PR Vitest Duration:** **369.71s**
- **Max observed tip-PR unit job wall:** **391s**
- **Result:** **no FLAG** — healthy CI unit runs stay under ~8 minutes with AI latency benches skipped under `CI=1`

## Sibling ownership (do not duplicate)

| Topic                                 | Owner                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------- |
| Wiki `ci-unit-budget.md` cell refresh | Prior series `#936` / `q-mp-446` (contained); tip owner may fold wiki later |
| Slowest-unit per-file inventory       | `#956` / `q-mp-460` (post914) — **do not duplicate**                        |
| Testing-layers file/case tables       | `#929` / `q-mp-445` and successors                                          |
| Full AI-timing CI-skip inventory      | `docs/dev/ai-timing-ci-skip-inventory-2026-10-09.md`                        |

## Acceptance checklist

- [x] Remeasure live tip post914 (suite **3245** / list **13100**; backlog **3242** / ~13070 was mid-fold stale)
- [x] Doc cites tip SHA + live file/case counts + observed wall
- [x] Does **not** raise budgets; Hex Hard **450ms** untouched
- [x] Report trio only (`docs/dev/*.md` + `.json` + `.svg`); no `src/` / test / workflow / `memory/` edits
- [x] Open drafts checked; `#936` / older wall drafts + `#956` left open as **contained** / orthogonal
- [x] FLAG assessment recorded (no FLAG; wall &lt; 420s)
