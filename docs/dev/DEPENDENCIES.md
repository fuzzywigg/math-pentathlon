# Dependency hygiene

**Audit date:** 2026-10-08  
**Task:** `burn-1008-mp-deps-hygiene`  
**Base:** `cursor/integration-fold-wave5-tip-4af0`

## Summary

`npm audit` reported **0 vulnerabilities** before and after this pass. Applied in-range **patch/minor** bumps only; no majors. Lockfile was re-resolved and `npm dedupe` run. No unused direct dependencies removed (aligned with dead-code PR #497 / `depcheck`: none unused; false positives only for Vite virtual `virtual:pwa-register` and script imports of `playwright` via `@playwright/test`).

## What changed

| Package | From (installed) | To | Kind |
| --- | --- | --- | --- |
| `@playwright/test` | 1.63.0 | 1.64.0 | minor |
| `typescript-eslint` | 8.71.0 | 8.71.1 | patch |
| `vite` | 7.3.6 (`package.json` was `^7.2.4`) | 7.3.7 (`^7.3.7`) | patch (+ range floor) |

Also: `npm dedupe` on the lockfile (no direct dependency removals).

## Deferred (needs major / coordinated upgrade)

These appear in `npm outdated` as newer **Latest** outside the current caret major. Do **not** land in a no-behavior-change hygiene PR:

| Package | Current | Latest | Suggested path |
| --- | --- | --- | --- |
| `eslint` + `@eslint/js` | 9.39.5 | 10.x | Flat-config ESLint 10 migration; re-run lint + unit |
| `vitest` + `@vitest/coverage-v8` | 4.1.11 | 5.x | Vitest 5 migration guide; update config + coverage |
| `jsdom` | 27.4.0 | 29.x | Jump via 28 → 29 after Vitest peer compatibility check |
| `typescript` | 5.9.3 | 6+/7.x | Stay on TS 5 until type-ratchet Phase-2 plan allows |
| `vite` | 7.3.7 | 8.x | Vite 8 + plugin peer bumps (`vite-plugin-pwa`, visualizer) |
| `rollup-plugin-visualizer` | 6.0.11 | 7.x | Pair with Vite 8 / Rollup peer bump |

**Note:** `vite-plugin-pwa@2.0.0` still pulls deprecated `glob@11.1.0` via `workbox-build`. Not flagged by `npm audit`; fix awaits upstream Workbox / plugin release (no safe patch/minor override without majors).

Existing `overrides` kept: `js-yaml@4.3.2`, `source-map-js@1.2.2`.

## Commands

```bash
npm audit
npm outdated
npm install --save-dev @playwright/test@1.64.0 typescript-eslint@8.71.1 vite@7.3.7
npm dedupe
npm run typecheck && npm run build && npm run test:unit && npm run test:e2e:chromium
npm run size:check
```
