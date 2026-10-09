# q-mp-175 / q-mp-233 — CI unit budget wiki page (pointer)

**Task id:** `q-mp-233` (refresh; original `q-mp-175`)  
**Role:** worker (docs / visuals only)  
**Tip:** `cursor/mp-tip-post728` @ `b5884207`

Canonical short page (Mermaid + tip CI evidence + HOLD): [`docs/wiki/ci-unit-budget.md`](../wiki/ci-unit-budget.md).

## Artifacts (real tip CI / local smoke)

| Path | What |
| --- | --- |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37972882883.txt` | Live tip unit log twin (run `37972882883` @ `b5884207`) |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37932241420.png` | Screenshot of tip unit log skip pattern (older tip fold run; pattern unchanged) |
| `docs/screenshots/ci/tip-unit-ai-benches-skipped-37932241420.txt` | Historical twin for run `37932241420` |
| `docs/screenshots/ci/local-CI1-ai-benches-skip-smoke.txt` | Local `CI=1` skip smoke for the two benches |

## Live tip re-measure (`b5884207`)

| Metric | Value |
| --- | ---: |
| Unit files | **3140** |
| Cases (`npx vitest list`) | **12154** |
| Tip CI Duration (run `37972882883`) | **298.65s** ≈ 5.0 min |
| Step / job timeouts (`ci.yml`) | **12m** / **14m** |
| Target wall | ~**8 min** |

## Sibling drafts (do not duplicate)

| Draft | Topic |
| --- | --- |
| [#732](https://github.com/fuzzywigg/math-pentathlon/pull/732) `q-mp-199` | Testing-layers + wiki **unit count** tables — leave open; this page owns wall budget + AI-bench skip evidence |
| [`ai-timing-ci-skip-inventory-2026-10-09.md`](./ai-timing-ci-skip-inventory-2026-10-09.md) | Full AI-timing CI-skip inventory + HOLD |
| [`ci-gates-mermaid-q-mp-073.md`](./ci-gates-mermaid-q-mp-073.md) | Blocking vs report-only job Mermaid — orthogonal |

## Hard rules (restated)

- No AI timing / search / scoring / difficulty edits; Hex Hard stays **450ms** (`src/games/hex/ai.ts`, `tests/unit/ai-hard-midgame-identity.test.ts`).
- Workflows untouched; keep `permissions: contents: read` and `persist-credentials: false`.
