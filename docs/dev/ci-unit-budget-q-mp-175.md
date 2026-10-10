# q-mp-175 / q-mp-233 / q-mp-289 / q-mp-338 / q-mp-388 — CI unit budget wiki page (pointer)

**Task id:** `q-mp-388` (wall-budget remeasure; prior `q-mp-338` / `q-mp-289` / `q-mp-233` / `q-mp-175`)  
**Role:** worker (docs / visuals only)  
**Tip:** `cursor/mp-tip-post865` @ `3908809d`

Canonical short page (Mermaid + tip CI evidence + HOLD): [`docs/wiki/ci-unit-budget.md`](../wiki/ci-unit-budget.md).

## Artifacts (real tip CI / local smoke)

| Path                                                              | What                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-38028521133.txt` | Post865 tip-fold unit log twin (run `38028521133` @ `3908809d`)                 |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-38027675957.txt` | Post865 tip-fold PR twin (run `38027675957` @ `ac05edf5`, same 3210-file suite) |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-38014419139.txt` | Historical post785 twin (run `38014419139` @ `c9b55cff`)                        |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-38013830311.txt` | Historical post785 tip-PR twin (run `38013830311` @ `47ca886d`, PR #831)        |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37999819714.txt` | Historical post755 twin (run `37999819714` @ `cb8e7e14`, PR #801)               |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37972882883.txt` | Historical post728 twin (run `37972882883` @ `b5884207`)                        |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37932241420.png` | Screenshot of tip unit log skip pattern (older tip fold run; pattern unchanged) |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37932241420.txt` | Historical twin for run `37932241420`                                           |
| `docs/screenshots/ci/local-CI1-ai-benches-skip-smoke.txt`         | Local `CI=1` skip smoke for the two benches                                     |

## Live tip re-measure (`3908809d` / wall evidence `38028521133`)

| Metric                                               |                 Value |
| ---------------------------------------------------- | --------------------: |
| Unit files (tip HEAD)                                |              **3210** |
| Cases (`npx vitest list`, tip HEAD)                  |             **12768** |
| Tip-fold CI Duration (run `38028521133`, 3210 files) | **372.35s** ≈ 6.2 min |
| Tip-fold PR Duration (run `38027675957`, 3210)       | **348.52s** ≈ 5.8 min |
| Step / job timeouts (`ci.yml`)                       |     **12m** / **14m** |
| Target wall                                          |            ~**8 min** |
| Slack before step timeout (tip-fold Duration)        |          ~**5.8 min** |

Prior post785 wall cite: Duration **276.08s** ≈ 4.6 min at **3182** files (run `38014419139`). Backlog `q-mp-388` mid-fold stamp **3194** / **12614** is superseded by live post865 **3210** / **12768**.

## Sibling drafts (do not duplicate)

| Draft                                                                                         | Topic                                                                                                         |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [#843](https://github.com/fuzzywigg/math-pentathlon/pull/843) `q-mp-338`                      | Older post785 wall-budget page — leave open as **contained**                                                  |
| [#810](https://github.com/fuzzywigg/math-pentathlon/pull/810) `q-mp-289`                      | Older post755 wall-budget page — leave open as **contained**                                                  |
| [#746](https://github.com/fuzzywigg/math-pentathlon/pull/746) `q-mp-233`                      | Older post728 wall-budget page — leave open as **contained**                                                  |
| [#791](https://github.com/fuzzywigg/math-pentathlon/pull/791) `q-mp-260` / backlog `q-mp-285` | Testing-layers + wiki **unit count** tables — leave open; this page owns wall budget + AI-bench skip evidence |
| [#849](https://github.com/fuzzywigg/math-pentathlon/pull/849) `q-mp-342` / backlog `q-mp-392` | Slowest-unit **per-file** inventory — leave open; wall cells stay here                                        |
| [`ai-timing-ci-skip-inventory-2026-10-09.md`](./ai-timing-ci-skip-inventory-2026-10-09.md)    | Full AI-timing CI-skip inventory + HOLD                                                                       |
| [`ci-gates-mermaid-q-mp-073.md`](./ci-gates-mermaid-q-mp-073.md)                              | Blocking vs report-only job Mermaid — orthogonal                                                              |

## Hard rules (restated)

- No AI timing / search / scoring / difficulty edits; Hex Hard stays **450ms** (`src/games/hex/ai.ts`, `tests/unit/ai-hard-midgame-identity.test.ts`).
- Workflows untouched; keep `permissions: contents: read` and `persist-credentials: false`.
