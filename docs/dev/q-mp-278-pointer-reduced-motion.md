# q-mp-278 — pointer-hygiene + reduced-motion characterization

Tests-only characterization for `src/ui/pointer-hygiene.ts` and
`src/ui/reduced-motion.ts` (void ui-other residual pair on tip post755).

## Scope

- New suite: `tests/unit/q-mp-278-pointer-hygiene-reduced-motion.test.ts`
- Enable/disable + OS preference-change re-apply under jsdom
- Residual pointer move / cancel / capture-release branches
- No `src/` edits; no AI, scoring, copy, or rules changes

## Coverage (same vitest project + related suites)

Measured with `npx vitest run --project unit-shared --coverage` over the
pointer / reduced-motion unit suites listed in the PR body.

| File                        | Metric           | Before          | After           |
| --------------------------- | ---------------- | --------------- | --------------- |
| `src/ui/pointer-hygiene.ts` | lines / branches | 96.92% / 90%    | **100% / 100%** |
| `src/ui/reduced-motion.ts`  | lines / branches | 96.87% / 96.42% | **100% / 100%** |

## Verify

```bash
npx vitest run --project unit-shared tests/unit/*pointer* tests/unit/*reduced-motion* tests/unit/q-mp-278-pointer-hygiene-reduced-motion.test.ts
npm run lint
npm run typecheck
npm run test:unit
```
