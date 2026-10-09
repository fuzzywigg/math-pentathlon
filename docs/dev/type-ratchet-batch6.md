# Type ratchet Batch 6 — remaining non-AI rules / engine

**Task:** `burn-1008-mp-type-ratchet-batch6-nonrules`  
**Tip fold:** `#557` after compliance review 4 (`#561`) — **COMPLIANT**  
**Policy:** Fold only emit-identical / pure `!` (or type annotations). **Hold** EOPT object rebuilds / spreads that change emit on rules/engine paths for Andrew.

## Folded on tip (8 emit-identical + surgical)

| Path | Style |
| --- | --- |
| `contig-60/rules.ts` | dense-board `!` — emit identical |
| `hex/rules.ts` | dense-board / tuple `!` — emit identical |
| `juggle/rules.ts` | dense-board `!` — emit identical |
| `kings-quadraphages/{board,game-state,rules}.ts` | dense-board `!` — emit identical |
| `kwatro-sinko/rules.ts` | dense / regex `!` — emit identical |
| `prime-gold/rules.ts` | dense-board `!` — emit identical |
| `stars-bars/rules.ts` | dense-board `!` + shuffle temp-`!` (same pairwise swap; emit differs only in swap lowering — accepted as pure `!`) |
| `pent-em-in/rules.ts` | dense-board / length-gate `!` only; **kept tip `{...cell}` spread** (no field-rebuild) |

## Held for Andrew (report-only)

| Path | Hunk | Why |
| --- | --- | --- |
| `pent-em-in/rules.ts` `:196–208` (#557 head) | EOPT-safe `BoardCell` rebuild (`{ row, col, occupied, owner, pieceId }` from `prev` instead of `{ ...cell, … }`) | Object rebuild on rules placement path — can affect serialization / `in` / equality if fields diverge; tip keeps spread |

Compliance #561 analyzed the rebuild as field-complete for current `BoardCell`, but tip-owner policy holds rebuilds/spreads on rules paths pending Andrew.

## Ceiling

Phase-2 out-of-scope: re-baselined **DOWN** to live combined count after this fold (target near **220**; never up).

## Deferred floor

| Category | Reason |
| --- | --- |
| All `ai.ts` / clients / workers | AI — Batch A + Andrew; Hex Hard 450ms stays |
| Held pent-em-in BoardCell rebuild | Andrew |
| Help / tutorial / copy | Skipped |
| Stars & Bars history cap | Hard rule — not touched |

## Reproduce

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 | rg -c "error TS"
npm run typecheck:ratchet
node docs/dev/type-ratchet-phase2-export.mjs --check
```
