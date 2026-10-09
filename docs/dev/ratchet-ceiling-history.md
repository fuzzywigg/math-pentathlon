# Ratchet ceiling history

Task: `q-mp-074`. Generated `2026-10-09T03:49:03.095Z` via `git log --all`.

Tracks three report-only ceilings over git history:

- **curly** — `docs/dev/lint-ratchet-ceilings.json` → `rules.curly`
- **type Phase-2 out-of-scope** — `docs/dev/type-ratchet-phase2-baseline.json` → `outOfScopeErrors`
- **boundary sum** — `docs/dev/module-boundaries-ceilings.json` → sum of `ceilings.*`

Chart (each series normalized to its own max):

![Ratchet ceiling history](./ratchet-ceiling-history.svg)

Regenerate with `npm run report:ratchet-history` (no network; reads local git only).

| SHA | Date | curly | type oos | boundary Σ | Subject |
| --- | --- | ---: | ---: | ---: | --- |
| `0842b62` | 2026-10-08 | — | 564 | — | docs: Phase-2 type-ratchet plan + baseline for AI/rules (burn-1007) |
| `cdc52b4` | 2026-10-08 | — | 564 | — | docs(dev): Phase 2 type-ratchet plan + report-only baseline |
| `293ca1d` | 2026-10-08 | — | 564 | — | docs: fold #502 Phase-2 type-ratchet plan; supersede #503 |
| `8719398` | 2026-10-08 | — | 518 | — | fix(types): clear Phase-2 Batch 0+1 ratchet errors (burn-1008) |
| `79b59a5` | 2026-10-08 | 1456 | 518 | — | chore(lint): enable TS lint ratchet + curly ceiling (burn-1008) |
| `df04cc1` | 2026-10-08 | 1456 | 520 | — | merge(#517): input-race guards; raise Phase-2 ceiling to 520 |
| `38e7c77` | 2026-10-08 | 1456 | 520 | 17 | test: module-boundary import-graph audit + check:boundaries ratchet |
| `0c82baf` | 2026-10-08 | 1456 | 520 | 17 | docs: note Vite mp3d↔game circular chunks in boundary ceilings |
| `b92b51c` | 2026-10-08 | 1456 | 433 | 17 | fix(types): Phase-2 type-ratchet Batch 2 (rules-heavy non-AI) |
| `e169269` | 2026-10-08 | 1437 | 433 | 17 | merge(#520): TS lint ratchet + curly ceiling (post-#518 autofix) |
| `a16a326` | 2026-10-08 | 1437 | 443 | 17 | fix(types): Phase-2 Batch 3 UI/shell type-ratchet (burn-1008) |
| `3475bb0` | 2026-10-08 | 1437 | 443 | 17 | docs: refresh #523 boundary ceilings tipSha after #518/#520/#521 |
| `ba5856d` | 2026-10-08 | 1437 | 433 | 17 | fix(types): Batch-2 type-ratchet compliant recut (supersedes #537) |
| `1dcd825` | 2026-10-08 | 1437 | 450 | 17 | fix(types): Phase-2 type-ratchet Batch 4 prime-gold UI/types (burn-1008) |
| `4336f93` | 2026-10-08 | 1437 | 450 | 17 | fix(types): Phase-2 type-ratchet Batch 4 prime-gold UI/types (burn-1008) |
| `d6c35e3` | 2026-10-08 | 1437 | 356 | 17 | merge(#544): type-ratchet Batch-3 UI/shell + re-baseline 433→356 |
| `e562175` | 2026-10-08 | 1437 | 286 | 17 | merge(#551): type-ratchet Batch-4 prime-gold UI/types + re-baseline 356→286 |
| `785212d` | 2026-10-08 | 1437 | 373 | 17 | fix(types): Phase-2 type-ratchet Batch 5 UI/shell compliant re-cut (burn-1008) |
| `62a9173` | 2026-10-08 | 1437 | 220 | 17 | fix(types): Phase-2 type-ratchet Batch 6 non-AI rules/engine (burn-1008) |
| `c383a5d` | 2026-10-08 | 1437 | 220 | 17 | fix(types): Phase-2 type-ratchet Batch 6 non-AI rules/engine (burn-1008) |
| `13812c5` | 2026-10-08 | 1437 | 0 | 17 | docs(types): lower Phase-2 ceiling 220→0 for AI type-only option |
| `0dc1e95` | 2026-10-08 | 1437 | 286 | 17 | chore(types): refresh Phase-2 baseline tipSha after #553 fold |
| `84f7d03` | 2026-10-08 | 1344 | 286 | 17 | fix(lint): restore curly:all ratchet after fold growth (1484→1344) |
| `6e75e5d` | 2026-10-08 | 1344 | 220 | 17 | chore(types): refresh Phase-2 baseline tipSha after #557 fold |
| `ffc8aff` | 2026-10-08 | 1344 | 220 | 17 | fix(types): fold #557 Batch-6 emit-identical rules/engine (! only) |
| `e65493c` | 2026-10-08 | 1344 | 216 | 17 | fix(types): Phase-2 type-ratchet Batch 7 shell/helper floor (burn-1008) |
| `caad3eb` | 2026-10-08 | 1344 | 216 | 17 | chore(types): refresh Phase-2 baseline tipSha after Batch 7 |
| `a2f1376` | 2026-10-08 | 1344 | 220 | 17 | chore(types): refresh Phase-2 baseline tipSha after #561 fold |
| `ff2c12a` | 2026-10-08 | 1344 | 216 | 17 | fix(types): Phase-2 type-ratchet Batch 8 helper-test floor (burn-1008) |
| `82bfaad` | 2026-10-08 | 1344 | 216 | 17 | chore(types): refresh Phase-2 baseline tipSha after Batch 8 |
| `5b72ec2` | 2026-10-08 | 1320 | 216 | 17 | restore alpha AI/copy surfaces per owner decision (pre-Friday) |
| `0bc7cb4` | 2026-10-08 | 1320 | 216 | 17 | chore(types): refresh Phase-2 baseline tipSha after Batch 9 |
| `bc5062d` | 2026-10-08 | 1320 | 216 | 17 | fix(types): Phase-2 type-ratchet Batch 9 post-restore UI/shell floor (burn-1008) |
| `5d1433e` | 2026-10-08 | 1320 | 216 | 17 | Tip fold wave5: Batch7–9, UI/engine coverage, mutation audits (#477) |
| `d1cbc58` | 2026-10-08 | 1320 | 216 | 17 | chore(types): refresh Phase-2 baseline tipSha after #582 fold |

