# q-mp-591 — Characterize `owl-component` soft-fail residuals

## Scope

Tests-only characterization of soft-fail residuals in
`src/ui/owl/owl-component.ts`. Zero `src/` / product edits. No nnnull /
nullish / void ceiling writes. No player-facing copy / aria / label / title
pins. Leave HELD `#727` alone. Leave undrafted `q-mp-366` / `q-mp-328`
**contained**.

## Live tip re-measure (`cursor/mp-tip-post1012` @ `3f9c3e4e`)

| Metric                                    |                                                Count |
| ----------------------------------------- | ---------------------------------------------------: |
| `owl-component.ts` LOC                    |                                              **800** |
| Dedicated soft-fail residual files before |                                                **0** |
| Overlay nnnull residual                   |                **1** (`this.container!` mood toggle) |
| Overlay nullish residual                  | **1** (`closest(character) \|\| closest(minimized)`) |
| Tip nnnull total / ceiling                |             **238 / 238** (unchanged by this ticket) |
| Tip nullish total / ceiling               |                              **65 / 65** (unchanged) |
| New suite tests                           |                                               **13** |

## What this suite owns

- Source keep-sites for overlay nnnull + nullish residuals, size/viewport/
  parseFloat soft-defaults, pointer-capture try/catch, elementFromPoint
  typeof soft-null, ResizeObserver undefined / empty-entry arms, optional
  querySelector wires, null-container soft `DOMRect`, owlEnabled soft-hide
- Pre-init soft API no-ops (`destroy` / `snapBack` / `minimize` / `expand` /
  `isVisible`)
- Minimized-handle nullish `||` arm; bubble/controls chrome soft-reject
- Zero-size rect soft-default drag lock (no NaN style)
- Mood class toggle through the nnnull keep-site (classList only)
- Non-primary / secondary-button pointer soft-ignore

## Verification

```bash
npx vitest run --project unit-shared tests/unit/*owl*
npx vitest run --project unit-shared \
  tests/unit/q-mp-591-owl-component-soft-fail-residuals.test.ts
npm run verify
```

Next action: fold into tip by the tip owner.
