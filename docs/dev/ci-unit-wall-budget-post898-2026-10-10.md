# q-mp-446 — CI unit wall-budget / test-speed remeasure (tip post898, 2026-10-10)

**Task id:** `q-mp-446`  
**Role:** worker (docs / json / svg only)  
**Tip audited:** `cursor/mp-tip-post898` @ `ad5a9f15` (full `ad5a9f15ec9fcfc0b44f1e5ee000489423086181`)  
**Wall evidence SHA:** `85522638` (same **3235**-file suite; tip-fold unit job completed before run cancel)  
**Measured at:** `2026-10-10T08:43:14Z` (UTC)  
**Machine summary:** [`ci-unit-wall-budget-post898-2026-10-10.json`](./ci-unit-wall-budget-post898-2026-10-10.json)  
**Chart:** [`ci-unit-wall-budget-post898-2026-10-10.svg`](./ci-unit-wall-budget-post898-2026-10-10.svg)  
**Scope:** Dated **wall-budget / test-speed** stamp. **No `src/` edits. No test-behavior edits. No CI workflow edits. No wall raise.**

## Purpose

Backlog `q-mp-446` (round 14 / `#921`) asked for a tip-post898 remeasure of the CI unit wall. Spec backlog stamped tip `788e8215` at **3224** files / **~12905** cases; prior wall docs (`q-mp-388` / `#887`) stamped post865 at **3210** / **12768**. This PR re-measures the **live** tip and records observed GHA Duration / job wall. **FLAG if unit wall > 420s** — **not raised** (primary tip Duration **199.97s**; max tip-PR Duration sample **362.95s**; max tip-PR job wall **384s**).

Canonical wiki page ownership stays with the `ci-unit-budget` series (`q-mp-388` / `#887`); this ticket ships a tip-stamped report trio only (constraint: docs/report/json/svg).

## Hard-rule HOLD (explicit)

| Rule                                                      | Live tip pin                                                            |
| --------------------------------------------------------- | ----------------------------------------------------------------------- |
| Hex Hard play deadline stays **450ms**                    | `src/games/hex/ai.ts` — `hard: 450`                                     |
| Do not enable the two AI benches on GHA                   | Keep `describe.skipIf(!!process.env.CI)`                                |
| Do **not** raise unit wall / step / job timeouts          | `ci.yml` unit: target ~**8 min**, step **12m**, job **14m** (unchanged) |
| CI permissions stay read-only                             | `permissions: contents: read` + `persist-credentials: false`            |
| No AI timing / search / scoring / difficulty / copy edits | HOLD                                                                    |

## Duplicate check (open drafts)

| Related draft / prior                                                                                                                               | Overlap                                        | Action                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| [#921](https://github.com/fuzzywigg/math-pentathlon/pull/921) `q-mp-090n`                                                                           | Defines this task; backlog only                | Leave open                                      |
| [#887](https://github.com/fuzzywigg/math-pentathlon/pull/887) `q-mp-388`                                                                            | Prior post865 wall stamp                       | Leave open as **contained**                     |
| [#843](https://github.com/fuzzywigg/math-pentathlon/pull/843) `q-mp-338` / [#810](https://github.com/fuzzywigg/math-pentathlon/pull/810) `q-mp-289` | Older tip wall stamps                          | Leave open as **contained**                     |
| [#891](https://github.com/fuzzywigg/math-pentathlon/pull/891) `q-mp-392`                                                                            | Slowest-unit **per-file** inventory            | Leave open; wall cells stay here                |
| Tip fold [#914](https://github.com/fuzzywigg/math-pentathlon/pull/914)                                                                              | Actively folding `#900`–`#913` / `#915`–`#921` | Tip head moves; this PR rebases onto latest tip |

No open draft into `cursor/mp-tip-post898` already owns a post898 unit **wall-budget** remeasure → full task proceeds.

## Method (live tip)

```text
$ git fetch origin cursor/mp-tip-post898 && git rev-parse HEAD
  ad5a9f15ec9fcfc0b44f1e5ee000489423086181

$ find tests/unit \( -name '*.test.ts' -o -name '*.spec.ts' \) ! -path '*/_tokenmaxx_archive/*' | wc -l
  3235

$ npx vitest list | wc -l
  12988

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ CI=1 npx vitest run --project unit-isolated tests/unit/tablet-ai-hard-latency.bench.test.ts
  Test Files  1 skipped (1); Tests  10 skipped (10)

$ CI=1 npx vitest run --project unit-shared tests/unit/ai-move-time-midgame.bench.test.ts
  Test Files  1 skipped (1); Tests  1 skipped (1)
```

Primary tip wall cite: tip-fold run [`38038340938`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38038340938) unit job @ `85522638` (**3235** files) completed successfully (Duration **199.97s**) even though the overall workflow run was later cancelled by a newer tip push. Docs stamp was then rebased onto tip HEAD `ad5a9f15` (suite size unchanged).

## Before → after metrics

| Metric                     | Before (wiki / post865 `q-mp-388`) | Stale backlog (`q-mp-446` @ `788e8215`) |                 After (live tip `ad5a9f15`) |
| -------------------------- | ---------------------------------: | --------------------------------------: | ------------------------------------------: |
| Unit files                 |                           **3210** |                                **3224** |                                    **3235** |
| Cases (`npx vitest list`)  |                          **12768** |                              **~12905** |                                   **12988** |
| Primary GHA Duration       |    **372.35s** (run `38028521133`) |                                     n/a |        **199.97s** tip unit (`38038340938`) |
| Max tip-PR Duration sample |                                n/a |                                     n/a | **362.95s** (run `38036200790`, 3223 files) |
| Primary tip unit job wall  |                           **389s** |                                     n/a |                **215s** (run `38038340938`) |
| Max tip-PR unit job wall   |                           **389s** |                                     n/a |                **384s** (run `38036200790`) |
| FLAG (>420s wall)          |                                 no |                                     n/a |                                      **no** |
| Budgets (`ci.yml`)         |                 ~8 min / 12m / 14m |                               unchanged |            **unchanged** (no workflow edit) |
| Hex Hard                   |                          **450ms** |                               **450ms** |                         **450ms** untouched |

### GHA wall evidence table

| Run                                                                                    | Context                           | SHA        | Suite files | Vitest Duration | Unit job wall |
| -------------------------------------------------------------------------------------- | --------------------------------- | ---------- | ----------: | --------------: | ------------: |
| [`38028521133`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38028521133) | post865 tip-fold (before)         | `3908809d` |        3210 |     **372.35s** |          389s |
| [`38034514441`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38034514441) | alpha tip-fold #898 (post898 cut) | `946d6f95` |        3222 |     **341.35s** |          359s |
| [`38038340938`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38038340938) | **tip post898 unit (primary)**    | `85522638` |    **3235** |     **199.97s** |      **215s** |
| [`38036200790`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38036200790) | tip-PR #917 (max Duration sample) | `cf8c9373` |        3223 |     **362.95s** |          384s |
| [`38036036627`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38036036627) | tip-PR #919                       | `362dcfe2` |        3223 |     **357.03s** |          379s |
| [`38036606903`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38036606903) | tip-PR #921 (backlog stamp size)  | `b833d582` |        3224 |     **198.50s** |          212s |
| [`38035979339`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38035979339) | tip-PR #918                       | `a310f431` |        3223 |     **280.99s** |          300s |
| [`38036042498`](https://github.com/fuzzywigg/math-pentathlon/actions/runs/38036042498) | tip-PR #920                       | `787256b2` |        3223 |     **223.39s** |          238s |

Primary tip summary (`38038340938` @ `85522638`): Test Files **3233** passed / **2** skipped (**3235**); Tests **12976** passed / **54** skipped (**13030**); both AI benches skipped under `CI=1`.

Local corroboration (not GHA wall cite) on the same SHA: Duration **140.75s**; matching file/test totals; `EXIT 0`.

## Budgets (unchanged)

From `.github/workflows/ci.yml` `unit` job (re-read on tip `ad5a9f15`; knobs unchanged; **workflows not edited**):

| Knob                                               | Value        |
| -------------------------------------------------- | ------------ |
| Target wall                                        | ~**8 min**   |
| Step timeout                                       | **12m**      |
| Job timeout                                        | **14m**      |
| Slack before 12m step (primary tip Duration)       | ~**8.7 min** |
| Slack before 12m step (max tip-PR Duration sample) | ~**5.6 min** |

## FLAG assessment

- **Threshold:** unit wall **> 420s**
- **Primary tip Vitest Duration:** **199.97s**
- **Primary tip unit job wall:** **215s**
- **Max observed tip-PR Vitest Duration:** **362.95s**
- **Max observed tip-PR unit job wall:** **384s**
- **Result:** **no FLAG** — healthy CI unit runs stay under ~8 minutes with AI latency benches skipped under `CI=1`

## Sibling ownership (do not duplicate)

| Topic                                 | Owner                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------- |
| Wiki `ci-unit-budget.md` cell refresh | Prior series `#887` / `q-mp-388` (contained); tip owner may fold wiki later |
| Slowest-unit per-file inventory       | `#891` / `q-mp-392`                                                         |
| Testing-layers file/case tables       | `#886` / `q-mp-386`                                                         |
| Full AI-timing CI-skip inventory      | `docs/dev/ai-timing-ci-skip-inventory-2026-10-09.md`                        |

## Acceptance checklist

- [x] Remeasure live tip post898 (not stale backlog **3224** / **~12905**)
- [x] Doc cites tip SHA + live file/case counts + observed wall
- [x] Does **not** raise budgets; Hex Hard **450ms** untouched
- [x] Report trio only (`docs/dev/*.md` + `.json` + `.svg`); no `src/` / test / workflow / `memory/` edits
- [x] Open drafts checked; `#887` / older wall drafts left open as **contained**
- [x] FLAG assessment recorded (no FLAG; wall &lt; 420s)
