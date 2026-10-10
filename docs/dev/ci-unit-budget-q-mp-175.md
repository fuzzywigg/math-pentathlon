# q-mp-175 / q-mp-233 / q-mp-289 / q-mp-338 — CI unit budget wiki page (pointer)

**Task id:** `q-mp-338` (wall-budget remeasure; prior `q-mp-289` / `q-mp-233` / `q-mp-175`)  
**Role:** worker (docs / visuals only)  
**Tip:** `cursor/mp-tip-post785` @ `c9b55cff`

Canonical short page (Mermaid + tip CI evidence + HOLD): [`docs/wiki/ci-unit-budget.md`](../wiki/ci-unit-budget.md).

## Artifacts (real tip CI / local smoke)

| Path                                                              | What                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-38014419139.txt` | Post785 tip-fold unit log twin (run `38014419139` @ `c9b55cff`)                 |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-38013830311.txt` | Post785 tip-PR twin (run `38013830311` @ `47ca886d`, PR #831)                   |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37999819714.txt` | Historical post755 twin (run `37999819714` @ `cb8e7e14`, PR #801)               |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37972882883.txt` | Historical post728 twin (run `37972882883` @ `b5884207`)                        |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37932241420.png` | Screenshot of tip unit log skip pattern (older tip fold run; pattern unchanged) |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37932241420.txt` | Historical twin for run `37932241420`                                           |
| `docs/screenshots/ci/local-CI1-ai-benches-skip-smoke.txt`         | Local `CI=1` skip smoke for the two benches                                     |

## Live tip re-measure (`c9b55cff` / wall evidence `38014419139`)

| Metric                                               |                 Value |
| ---------------------------------------------------- | --------------------: |
| Unit files (tip HEAD)                                |              **3182** |
| Cases (`npx vitest list`, tip HEAD)                  |             **12490** |
| Tip-fold CI Duration (run `38014419139`, 3182 files) | **276.08s** ≈ 4.6 min |
| Tip-PR sample Duration (run `38013830311`, 3181)     | **356.89s** ≈ 6.0 min |
| Step / job timeouts (`ci.yml`)                       |     **12m** / **14m** |
| Target wall                                          |            ~**8 min** |
| Slack before step timeout (tip-fold Duration)        |          ~**7.4 min** |

Prior post755 wall cite: Duration **348.43s** ≈ 5.8 min at **3163** files (run `37999819714`).

## Sibling drafts (do not duplicate)

| Draft                                                                                         | Topic                                                                                                         |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [#810](https://github.com/fuzzywigg/math-pentathlon/pull/810) `q-mp-289`                      | Older post755 wall-budget page — leave open as **contained**                                                  |
| [#746](https://github.com/fuzzywigg/math-pentathlon/pull/746) `q-mp-233`                      | Older post728 wall-budget page — leave open as **contained**                                                  |
| [#791](https://github.com/fuzzywigg/math-pentathlon/pull/791) `q-mp-260` / backlog `q-mp-285` | Testing-layers + wiki **unit count** tables — leave open; this page owns wall budget + AI-bench skip evidence |
| [`ai-timing-ci-skip-inventory-2026-10-09.md`](./ai-timing-ci-skip-inventory-2026-10-09.md)    | Full AI-timing CI-skip inventory + HOLD                                                                       |
| [`ci-gates-mermaid-q-mp-073.md`](./ci-gates-mermaid-q-mp-073.md)                              | Blocking vs report-only job Mermaid — orthogonal                                                              |

## Hard rules (restated)

- No AI timing / search / scoring / difficulty edits; Hex Hard stays **450ms** (`src/games/hex/ai.ts`, `tests/unit/ai-hard-midgame-identity.test.ts`).
- Workflows untouched; keep `permissions: contents: read` and `persist-credentials: false`.
