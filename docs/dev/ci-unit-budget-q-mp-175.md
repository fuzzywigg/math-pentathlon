# q-mp-175 — CI unit budget wiki page (pointer)

**Task id:** `q-mp-175`  
**Role:** worker (docs / visuals only)

Canonical short page (Mermaid + tip CI screenshot + HOLD): [`docs/wiki/ci-unit-budget.md`](../wiki/ci-unit-budget.md).

## Artifacts (real tip CI / local smoke)

| Path | What |
| --- | --- |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37932241420.png` | Screenshot of tip unit log (run `37932241420`) |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37932241420.txt` | Same GHA lines, ANSI stripped |
| `docs/screenshots/ci/local-CI1-ai-benches-skip-smoke.txt` | Local `CI=1` skip smoke for the two benches |

## Sibling drafts (do not duplicate)

| Draft | Topic |
| --- | --- |
| [#693](https://github.com/fuzzywigg/math-pentathlon/pull/693) `q-mp-165` | Full AI-timing CI-skip inventory + HOLD — preferred inventory content |
| [#597](https://github.com/fuzzywigg/math-pentathlon/pull/597) `q-mp-073` | Blocking vs report-only job Mermaid — orthogonal |

## Hard rules (restated)

- No AI timing / search / scoring / difficulty edits; Hex Hard stays **450ms** (`src/games/hex/ai.ts`, `tests/unit/ai-hard-midgame-identity.test.ts`).
- Workflows untouched; keep `permissions: contents: read` and `persist-credentials: false`.
