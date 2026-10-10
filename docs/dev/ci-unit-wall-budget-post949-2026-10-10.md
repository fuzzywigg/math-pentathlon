# q-mp-541 — CI unit wall-budget / test-speed remeasure (tip post949, 2026-10-10)

**Task id:** `q-mp-541`  
**Role:** worker (docs / json / svg only)  
**Tip audited:** `cursor/mp-tip-post949` @ `96234101` (full `9623410197c1c761aaae4f52bbf303791580e8a0`)  
**Wall evidence SHA:** `68f1548f` (latest **successful** tip-fold unit job; suite **3280** — tip HEAD still **3280**)  
**Measured at:** `2026-10-10T14:22:00Z` (UTC)  
**Machine summary:** [`ci-unit-wall-budget-post949-2026-10-10.json`](./ci-unit-wall-budget-post949-2026-10-10.json)  
**Chart:** [`ci-unit-wall-budget-post949-2026-10-10.svg`](./ci-unit-wall-budget-post949-2026-10-10.svg)  
**Scope:** Dated **wall-budget / test-speed** stamp. **No `src/` edits. No test-behavior edits. No CI workflow edits. No wall raise.** Orthogonal to slowest **per-file** inventory tasks.

## Purpose

Backlog `q-mp-541` (round 18 / `#995`) asked for a tip-post949 remeasure of the CI unit wall. Spec backlog stamped tip mid-fold at **3270** files / **~13308** cases; prior wall docs (`q-mp-496` / `#973`) stamped post914 at **3245** / **13100**. This PR re-measures the **live** tip (tip owner `#977` still folding) and records observed GHA Duration / job wall. **FLAG if unit wall > 420s** — **not raised** (primary tip Duration **365.55s** / job wall **387s**; max tip-PR Duration sample **375.52s** / job wall **396s**; same-size **3280**-file tip-PR sample Duration **372.71s** / job wall **389s**).

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

| Related draft / prior                                                                                                     | Overlap                      | Action                                         |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------- |
| [#995](https://github.com/fuzzywigg/math-pentathlon/pull/995) `q-mp-090r`                                                 | Defines this task; backlog only | Leave open                                  |
| [#973](https://github.com/fuzzywigg/math-pentathlon/pull/973) `q-mp-496`                                                  | Prior post914 wall stamp     | Leave open as **contained**                    |
| [#936](https://github.com/fuzzywigg/math-pentathlon/pull/936) `q-mp-446`                                                  | Prior post898 wall stamp     | Leave open as **contained**                    |
| Tip fold [#977](https://github.com/fuzzywigg/math-pentathlon/pull/977)                                                    | Tip owner folding drafts into post949 | Tip head moves; this PR rebases onto latest tip |

No open draft into `cursor/mp-tip-post949` already owns a post949 unit **wall-budget** remeasure → full task proceeds.

## Method (live tip)

```text
$ git fetch origin cursor/mp-tip-post949 && git rev-parse HEAD
  9623410197c1c761aaae4f52bbf303791580e8a0

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3280

$ npx vitest list | wc -l
  13408

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ CI=1 npx vitest run --project unit-isolated tests/unit/tablet-ai-hard-latency.bench.test.ts
  Test Files  1 skipped (1); Tests  10 skipped (10)

$ CI=1 npx vitest run --project unit-shared tests/unit/ai-move-time-midgame.bench.test.ts
  Test Files  1 skipped (1); Tests  1 skipped (1)
```

Primary tip wall cite: tip-fold run [`38056924144`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38056924144) unit job @ `68f1548f` (**3280** files) — Vitest Duration **365.55s**, unit job wall **387s**, Run-unit-tests step **367s**. Both AI benches skipped under `CI=1`. Later tip-fold runs after `68f1548f` were cancelled by successive tip pushes (or still in progress) before unit completed; suite on live tip HEAD remains **3280** / **13408**.

## Before → after metrics

| Metric                     | Before (post914 `q-mp-496`) | Stale backlog (`q-mp-541`) |                 After (live tip `96234101`) |
| -------------------------- | --------------------------: | -------------------------: | ------------------------------------------: |
| Unit files                 |                    **3245** |                   **3270** |                                    **3280** |
| Cases (`npx vitest list`)  |                   **13100** |                 **~13308** |                                   **13408** |
| Primary GHA Duration       | **357.17s** (`38041487792`) |                        n/a | **365.55s** tip unit (`38056924144` @ 3280) |
| Max tip-PR Duration sample |       **369.71s** (post914) |                        n/a |  **375.52s** (run `38052293441`, PR `#987`) |
| Primary tip unit job wall  |                    **378s** |                        n/a |                **387s** (run `38056924144`) |
| Max tip-PR unit job wall   |                    **391s** |                        n/a |                **396s** (run `38052293441`) |
| Same-size tip-PR (3280)    |                         n/a |                        n/a |     **372.71s** / **389s** wall (PR `#998`) |
| FLAG (>420s wall)          |                          no |                        n/a |                                      **no** |
| Budgets (`ci.yml`)         |          ~8 min / 12m / 14m |                  unchanged |            **unchanged** (no workflow edit) |
| Hex Hard                   |                   **450ms** |                  **450ms** |                         **450ms** untouched |

### GHA wall evidence table

| Run                                                                                    | Context                              | SHA        | Suite files | Vitest Duration | Unit job wall |
| -------------------------------------------------------------------------------------- | ------------------------------------ | ---------- | ----------: | --------------: | ------------: |
| [`38041487792`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38041487792) | post914 tip wall (before)            | `e43a25d2` |        3242 |     **357.17s** |          378s |
| [`38056924144`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38056924144) | **tip post949 unit (primary)**       | `68f1548f` |        3280 |     **365.55s** |      **387s** |
| [`38052293441`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38052293441) | tip-PR `#987` (max Duration / wall)  | `c268bdfd` |        3271 |     **375.52s** |          396s |
| [`38053969812`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38053969812) | tip-PR `#991`                        | `67f8f273` |        3271 |     **374.52s** |          392s |
| [`38057127536`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38057127536) | tip-PR `#998` (3280-file max sample) | `9ec9f9d5` |    **3280** |     **372.71s** |          389s |
| [`38054237823`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38054237823) | tip-PR `#994`                        | `277e318e` |        3271 |     **367.81s** |          390s |
| [`38057100122`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38057100122) | tip-PR `#997`                        | `4d2bdc54` |        3280 |     **363.73s** |          381s |
| [`38051959267`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38051959267) | tip-PR `#978`                        | `fe92787c` |        3268 |     **359.55s** |          377s |
| [`38054374553`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38054374553) | tip-PR `#993`                        | `3ea9f0ed` |        3271 |     **355.81s** |          373s |
| [`38057209911`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38057209911) | tip-PR `#1000`                       | `0f5445b5` |        3280 |     **351.42s** |          373s |
| [`38054073230`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38054073230) | tip-PR `#992`                        | `56307c36` |        3271 |     **348.77s** |          369s |
| [`38057615233`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38057615233) | tip-PR `#1001`                       | `90d77ecc` |        3280 |     **283.78s** |          302s |
| [`38057194448`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38057194448) | tip-PR `#999`                        | `5c18a3eb` |        3280 |     **280.79s** |          306s |
| [`38057090501`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38057090501) | tip-PR `#996` (fast 3280 sample)     | `fc7170ae` |        3280 |     **205.82s** |          220s |

Primary tip summary (`38056924144` @ `68f1548f`): Test Files **3278** passed / **2** skipped (**3280**); Tests **13396** passed / **62** skipped (**13458**); both AI benches skipped under `CI=1`.

Local AI-bench skip smoke on tip HEAD `96234101` (`CI=1`): both benches skipped (tablet **10** skipped; midgame **1** skipped).

Local corroboration on tip HEAD `96234101` + this PR docs (`CI=1 npm run test:unit`): Duration **159.25s**; Test Files **3278** passed / **2** skipped (**3280**); Tests **13396** passed / **62** skipped (**13458**); `EXIT 0` (agent host; not the GHA wall cite).

## Budgets (unchanged)

From `.github/workflows/ci.yml` `unit` job (re-read on tip `96234101`; knobs unchanged; **workflows not edited**):

| Knob                                               | Value        |
| -------------------------------------------------- | ------------ |
| Target wall                                        | ~**8 min**   |
| Step timeout                                       | **12m**      |
| Job timeout                                        | **14m**      |
| Slack before 12m step (primary tip Duration)       | ~**5.9 min** |
| Slack before 12m step (max tip-PR Duration sample) | ~**5.7 min** |

## FLAG assessment

- **Threshold:** unit wall **> 420s**
- **Primary tip Vitest Duration:** **365.55s**
- **Primary tip unit job wall:** **387s**
- **Max observed tip-PR Vitest Duration:** **375.52s**
- **Max observed tip-PR unit job wall:** **396s**
- **Result:** **no FLAG** — healthy CI unit runs stay under ~8 minutes with AI latency benches skipped under `CI=1`

## Sibling ownership (do not duplicate)

| Topic                                 | Owner                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------- |
| Wiki `ci-unit-budget.md` cell refresh | Prior series `#936` / `q-mp-446` (contained); tip owner may fold wiki later |
| Slowest-unit per-file inventory       | Orthogonal series — **do not duplicate**                                    |
| Testing-layers / wiki count tables    | `q-mp-540` and successors                                                   |
| Full AI-timing CI-skip inventory      | `docs/dev/ai-timing-ci-skip-inventory-2026-10-09.md`                        |

## Acceptance checklist

- [x] Remeasure live tip post949 (suite **3280** / list **13408**; backlog **3270** / ~13308 was mid-fold stale)
- [x] Doc cites tip SHA + live file/case counts + observed wall
- [x] Does **not** raise budgets; Hex Hard **450ms** untouched
- [x] Report trio only (`docs/dev/*.md` + `.json` + `.svg`); no `src/` / test / workflow / `memory/` edits
- [x] Open drafts checked; `#973` / `#936` left open as **contained**
- [x] FLAG assessment recorded (no FLAG; wall &lt; 420s)
