# q-mp-513 — Knip unusedExports inventory (tip post949, 2026-10-10)

**Task id:** `q-mp-513`  
**Role:** worker (docs / data / chart only)  
**Tip audited:** `cursor/mp-tip-post949` @ `8698fffb` (full `8698fffb85b1e3d2289e54a665fac6162d3bdee4`)  
**Measured at:** `2026-10-10T12:23:06Z` (UTC)  
**Machine summary:** [`knip-unused-exports-inventory-post949-2026-10-10.json`](./knip-unused-exports-inventory-post949-2026-10-10.json)  
**Chart:** [`knip-unused-exports-inventory-post949-2026-10-10.svg`](./knip-unused-exports-inventory-post949-2026-10-10.svg)  
**Scope:** Dated **unusedExports** inventory of live `npm run report:knip` vs committed [`knip-baseline.json`](./knip-baseline.json), plus the report-script vs knip-text count delta. **No `src/` edits. No `knip-baseline.json` edits. No AI export deletes.**

## Purpose

Backlog `q-mp-513` (round 17 / `docs/dev/backlog-2026-10-10h.md`) was written against tip `cursor/mp-tip-post914` evidence: `report:knip` unusedExports **3** / baseline **3**; direct `npx knip` text **1** (`cancelFabAiRequests`). Worker base is now `cursor/mp-tip-post949` — **re-measure on the live tip**. This ticket owns the **exports** surface only (not unusedTypes drift / demotes).

Related tip stamps (leave open; **contained** for exports ownership — do not close):

| Related draft / prior | Overlap | Action |
| --- | --- | --- |
| [#947](https://github.com/fuzzywigg/math-pentathlon/pull/947) `q-mp-463` knip metrics drift | unusedTypes **32**/36 + notes exports=3 | Leave open; **contained** (this PR owns exports inventory) |
| [#955](https://github.com/fuzzywigg/math-pentathlon/pull/955) `q-mp-090p` backlog 10g / `508` demotes | Rank-3 unusedTypes demotes | Leave open; **contained** |
| Undrafted `q-mp-253` | Owns `cancelFabAiRequests` delete | Leave alone; **EXCLUDED** here |
| [#971](https://github.com/fuzzywigg/math-pentathlon/pull/971) `q-mp-090q` backlog 10h | Defines this task; does not ship the inventory | Leave open |

Open drafts into `cursor/mp-tip-post949` at re-measure (`#978` void idle-warm, `#979` boundaries/PWA, `#980` return-await, `#981` dice-selector) — **none** own knip unusedExports → full task proceeds.

## Hard-rule HOLD (explicit)

- Do **not** delete or edit unused export `cancelFabAiRequests` (owned by undrafted `q-mp-253`)
- Do **not** edit AI protocol / `src/games/*/ai.ts` / AI search / scoring / difficulty / move timing
- Do **not** edit `*/rules.ts`, legal-move, or scoring paths; Hex Hard stays **450ms**
- Do **not** edit `knip-baseline.json` from this docs PR (ratchets only go down in their own tickets)
- No `memory/` files; no player-facing copy / aria changes

## Method (live tip)

```text
$ git rev-parse origin/cursor/mp-tip-post949
  8698fffb85b1e3d2289e54a665fac6162d3bdee4

$ npm run report:knip -- --json
  unusedFiles: 0
  unusedExports: 3
  unusedTypes: 32
  unusedDependencies: 0
  unusedDevDependencies: 0
  unlisted: 3
  duplicates: 0
  [NOTICE] knip unused surface within baseline (exports=3, types=32, files=0)
  [NOTICE] knip unused shrink: unusedTypes 36→32 (-4)

$ npx --yes knip@5.88.1 --include exports --reporter compact
  src/core/storage/index.ts: isPlainProgressObject, sanitizeSettings (StorageBarrel)
  src/games/fab-a-diffy/ai-client.ts: cancelFabAiRequests (fabAiClient)

$ npx --yes knip@5.88.1 --reporter compact
  # header "Unused exports (2)" = 2 file groups; 3 named exports inside

$ npx --yes knip@6.41.0 --include exports --reporter compact
  src/games/fab-a-diffy/ai-client.ts: cancelFabAiRequests (fabAiClient)
  # only 1 named export — knip 6 no longer flags the storage barrel pair

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,
```

Listing captured with pinned `knip@5.88.1` / committed [`knip.json`](../../knip.json). Baseline file untouched (`unusedExports: 3`).

## Report-script vs knip-text count delta

| Probe | Version | What it counts | Result on tip `8698fffb` |
| --- | --- | --- | ---: |
| `npm run report:knip` | pinned **5.88.1** JSON (`issue.exports` name count) | Named unused exports | **3** |
| `npx knip@5.88.1 --include exports --reporter compact` | **5.88.1** | Named unused exports (listed) | **3** |
| `npx knip@5.88.1` default compact header | **5.88.1** | File / issue **groups** in the section title | **2** groups (3 names) |
| Bare `npx knip` / `knip@6.41.0 --include exports` | **6.x** (unpinned) | Named unused exports under knip 6 rules | **1** (`cancelFabAiRequests` only) |
| Committed [`knip-baseline.json`](./knip-baseline.json) | — | Floor for report:knip | **3** |

**Why the backlog said “text **1**”:** unpinned `npx knip` resolves latest **6.x**, which drops the storage barrel pair from unusedExports. The CI / `report:knip` path stays on pinned **5.88.1** and still reports **3**. Document both; do **not** treat knip-6 “1” as a baseline demote signal from this ticket.

## Before → after metrics (report-only stamp)

| Metric | Spec backlog (`q-mp-513` @ post914) | Committed baseline on tip | Live tip `8698fffb` / post949 | This PR |
| --- | ---: | ---: | ---: | --- |
| `unusedExports` (report:knip / 5.88.1) | **3** | **3** | **3** | Docs only; **no** baseline write |
| knip-text (unpinned 6.x) | **1** | n/a | **1** | Documented delta only |
| `unusedTypes` | (out of scope) | **36** | **32** (−4 NOTICE) | Owned by `#947` / demote tickets |
| Tip SHA stamp | post914 evidence | post949 payload | **`8698fffb`** | inventory + SVG + JSON |

**Spec staleness:** backlog tip label said post914; live tip is post949 @ `8698fffb` (tip-owner `q-mp-026o` re-anchor). Export counts (**3** / text **1**) are **unchanged** vs the backlog stamp after re-measure.

## Disposition overview (live 3)

![q-mp-513 Knip unusedExports disposition](./knip-unused-exports-inventory-post949-2026-10-10.svg)

| Disposition | Count | Meaning |
| --- | ---: | --- |
| `LEAVE_STORAGE_BARREL` | **2** | Barrel re-exports on `src/core/storage/index.ts` — used inside the storage module; unused as public barrel surface under knip 5.88.1 |
| `EXCLUDED_Q_MP_253` | **1** | `cancelFabAiRequests` — undrafted owner; do not delete from this ticket |
| Total live (report:knip) | **3** | Matches baseline |

## Disposition table (live unusedExports)

| Export | File | Disposition |
| --- | --- | --- |
| `isPlainProgressObject` | `src/core/storage/index.ts` | **LEAVE** — storage barrel; internal importers use `migrate.ts` / `storage.ts` directly. Dedicated export triage later; not this ticket. |
| `sanitizeSettings` | `src/core/storage/index.ts` | **LEAVE** — same barrel story (`sanitize.ts` is the canonical definition). |
| `cancelFabAiRequests` | `src/games/fab-a-diffy/ai-client.ts` | **EXCLUDED** — undrafted `q-mp-253`; hard-rule HOLD (AI client surface). |

## Out-of-scope (do not touch from this inventory)

| Item | Kind | Owner / reason |
| --- | --- | --- |
| `cancelFabAiRequests` | unusedExports | Undrafted `q-mp-253` |
| Storage barrel pair demote / remove | unusedExports | Future dedicated triage — not claimed here |
| All unusedTypes / Rank-3 demotes | unusedTypes | `#947` / `#955` / `508` / refill demote tickets |
| `knip-baseline.json` edits | baseline | Ratchet tickets only (downward) |
| `esbuild` + `playwright` ×2 | unlisted | Documented intentional (`knip-report.md`) |

## Cross-links

- Baseline file: [`knip-baseline.json`](./knip-baseline.json) (untouched here; `unusedExports: 3`)
- Narrative + unlisted owners: [`knip-report.md`](./knip-report.md)
- Metrics-drift stamp (types focus): [`knip-live-metrics-drift-inventory-post914-2026-10-10.md`](./knip-live-metrics-drift-inventory-post914-2026-10-10.md)
- Rank-3 unusedTypes planning: [`knip-rank3-unused-types-inventory-2026-10-10.md`](./knip-rank3-unused-types-inventory-2026-10-10.md)

## Acceptance

- [x] Tip SHA + disposition table for live post949 re-measure
- [x] Report-script vs knip-text count delta documented (3 vs 1 / group header 2)
- [x] Visual chart + machine JSON
- [x] `cancelFabAiRequests` marked EXCLUDED; no AI export deletes
- [x] No `knip-baseline.json` / `src/` / test behavior edits
- [x] Spec tip label staleness called out (post914 → post949; counts unchanged)
- [x] `check:dev-docs` clean (verified in PR body)
