# Dependency security-advisory audit

**Task:** `burn-1008-mp-dependency-advisory-audit`  
**Date:** 2026-10-08  
**Tip base:** `cursor/integration-fold-wave5-tip-4af0` @ `0dc1e9537f9f2877270a9b0e66510f8d609921c8`  
**Related (not duplicated):** license/SBOM #532 (+ owner notes #554 / `docs/dev/LICENSES.md`); build reproducibility #524 (`npm run check:build` / `docs/build-repro-2026-10-08.md`); patch/minor hygiene #512 (`docs/dev/DEPENDENCIES.md`).

## Scope and method

On a clean tip tree after `npm ci`:

1. `npm audit --json` (full tree) and `npm audit --omit=dev` (runtime-shipped surface).
2. `npm outdated --json` for recommendation / owner-decision majors.
3. Classify every advisory by: package, severity, runtime-shipped vs dev/build-only, reachability in this app, minimal fix.
4. Apply **only** patch-level (or changelog-safe minor) fixes that clear a listed advisory, via `npm update <pkg>` or a scoped `overrides` entry. Never `npm audit fix --force`, never major bumps, never runtime game/AI edits. Defer anything that would change PWA/service-worker or Vite output in a user-visible way.
5. Prove build unaffected: dist file list + sizes before/after; run `npm run check:build` when present on tip.

## Overlap check (open drafts)

No open draft covers a security-advisory pass on the tip. Closest related work:

| PR / doc | Topic | Relation |
| --- | --- | --- |
| #512 (merged) / `docs/dev/DEPENDENCIES.md` | Patch/minor hygiene; 0 audit vulns at that pass | Hygiene only — not an advisory classification table |
| #532 / #554 / `docs/dev/LICENSES.md` | CycloneDX SBOM + license acceptances | Licenses, not CVE/GHSA |
| #524 / `docs/build-repro-2026-10-08.md` | Reproducible Vite/PWA + `check:build` | Used here as proof harness; not security |

## Advisory table (`npm audit`)

**Result: zero advisories** on tip after `npm ci`.

| Metric | Full tree | Production (`--omit=dev`) |
| --- | --- | ---: |
| info | 0 | 0 |
| low | 0 | 0 |
| moderate | 0 | 0 |
| high | 0 | 0 |
| critical | 0 | 0 |
| **total** | **0** | **0** |
| Dependencies audited | 585 (prod 2 / dev 584 / optional 52) | `three@0.186.1` only |

Empty classification table (kept so the report schema is complete):

| Package | Severity | Advisory | Runtime-shipped? | Reachable in this app? | Minimal fix | Status |
| --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | **none listed by `npm audit`** |

### Runtime-shipped surface

| Package | Role | Notes |
| --- | --- | --- |
| `three@0.186.1` | Sole direct `dependencies` entry; MP3D / 3D boards | No audit findings. Majors deferred (see below). |

Everything else in the lockfile is `devDependencies` (Vite, Vitest, Playwright, ESLint, TypeScript, `vite-plugin-pwa` / Workbox, etc.) and is **not** shipped to players in the production bundle except as build tooling that emits static assets.

## Package changes applied

**None.** Per task rule: with zero advisories, ship the report and make no package / lockfile edits.

| Action | Result |
| --- | --- |
| `npm update <pkg>` for advisory fixes | Not needed |
| Scoped `overrides` additions | Not needed (existing `js-yaml@4.3.2`, `source-map-js@1.2.2` left untouched) |
| `npm audit fix --force` | **Not run** |
| Major bumps | **Not run** |

## Deferred / notes (not `npm audit` findings)

### `glob@11.1.0` deprecation (build-only)

`npm ci` prints:

> `npm warn deprecated glob@11.1.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities…`

| Field | Value |
| --- | --- |
| Why present | `vite-plugin-pwa@2.0.0` → `workbox-build@7.4.1` → `glob@^11.0.1` → resolved **11.1.0** |
| Runtime-shipped? | **No** — build-time only (PWA `generateSW` / Workbox packaging) |
| In `npm audit`? | **No** (0 vulns) |
| Known GHSA | [GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) (glob CLI `-c/--cmd` injection) — vulnerable ranges `>=10.2.0 <10.5.0` and `>=11.0.0 <11.1.0`; **first patched 11.x is 11.1.0**. Installed version is already the patched 11.x line. |
| Reachable in this app? | CLI `-c/--cmd` path is not how Workbox invokes `glob` during our Vite build; still **dev/build-only**. |
| Minimal fix | Upstream: Workbox / `vite-plugin-pwa` move off deprecated 11.x. Local override to `glob@13` would be a **major** and can change Workbox/PWA generateSW behavior → **deferred** (would touch SW/precache output). |
| Status | **Deferred — owner decision** (coordinate with PWA plugin upgrade; do not blind-override). Same note as `docs/dev/DEPENDENCIES.md`. |

### Existing overrides (context only)

| Override | Purpose (from prior hygiene / audit history) | Changed this pass? |
| --- | --- | --- |
| `js-yaml@4.3.2` | Pin away from vulnerable older transitive lines | No |
| `source-map-js@1.2.2` | Pin for build consistency / prior advisory hygiene | No |

## Outdated table (`npm outdated --json` after `npm ci`)

All listed packages are already at `wanted` (caret floor). Every row is a **major** (or multi-major) jump to `latest` — owner decisions, not auto-landed.

| Package | Current | Wanted | Latest | Kind | Runtime-shipped? | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| `@eslint/js` | 9.39.5 | 9.39.5 | 10.0.1 | major | No (lint) | Pair with `eslint` 10 flat-config migration |
| `eslint` | 9.39.5 | 9.39.5 | 10.12.0 | major | No (lint) | ESLint 10 migration; re-run lint + unit |
| `vitest` | 4.1.11 | 4.1.11 | 5.0.3 | major | No (test) | Vitest 5 guide; update config + coverage |
| `@vitest/coverage-v8` | 4.1.11 | 4.1.11 | 5.0.3 | major | No (test) | With Vitest 5 |
| `jsdom` | 27.4.0 | 27.4.0 | 29.1.1 | major | No (test) | Step 28 → 29 after Vitest peer check |
| `typescript` | 5.9.3 | 5.9.3 | 7.0.2 | major | No (build) | Stay on TS 5 until type-ratchet Phase-2 allows |
| `vite` | 7.3.7 | 7.3.7 | 8.3.3 | major | No (build; emits player assets) | Vite 8 + `vite-plugin-pwa` / visualizer peers; **owner** — can change chunk hashes / SW |
| `rollup-plugin-visualizer` | 6.0.11 | 6.0.11 | 7.1.1 | major | No (build report) | Pair with Vite 8 / Rollup peers |
| `js-yaml` | 4.3.2 | 4.3.2 | 5.4.3 | major | No (scripts/CI) | Major API change; keep override pin until scripts migrated |

Direct packages at latest within range (not in `npm outdated`): `@playwright/test@1.64.0`, `typescript-eslint@8.71.1`, `prettier`, `axe-core` / `@axe-core/playwright`, `@types/three`, `eslint-config-prettier`, `three@0.186.1`, `vite-plugin-pwa@2.0.0`.

## Owner decisions needed (majors)

1. **ESLint 10** (`eslint` + `@eslint/js`) — lint-only; schedule after tip fold window.
2. **Vitest 5** (+ `@vitest/coverage-v8`, likely `jsdom` 28/29) — test-only; large config surface.
3. **TypeScript 6/7** — blocked by Phase-2 type-ratchet plan.
4. **Vite 8** (+ `rollup-plugin-visualizer` 7, `vite-plugin-pwa` peers) — build/PWA; expect chunk-hash and possibly SW/precache diffs; treat as intentional user-visible build change.
5. **`js-yaml` 5** — drop/replace override after script audit.
6. **`glob` via Workbox** — wait for upstream `workbox-build` / `vite-plugin-pwa`; do not force major override (SW risk).

## Build unaffected proof

No lockfile / `package.json` edits → dist must match tip. Captured after `npm ci` + `npm run build`:

| Metric | Value |
| --- | --- |
| Dist files | 74 |
| Dist total bytes | 1 917 887 |
| Precache entries (PWA generateSW) | 67 (1773.92 KiB) |
| Sole prod dependency in bundle | `three` (~747 kB raw chunk) |

Before/after comparison (same tip, no package changes; second `npm run build` after this doc-only commit):

| Check | Result |
| --- | --- |
| File list equality | Identical (74 paths) |
| Per-file sizes | Identical |
| `npm run check:build` | See verification section / `test-results/build/summary.md` |

Artifact paths used during the pass: `/opt/cursor/artifacts/dep-advisory/` (`audit-before.json`, `outdated-after-ci.json`, `dist-inventory-before.json`, logs).

## Verification commands

```bash
npm ci
npm audit --json          # before: total 0; after: total 0 (no package edits)
npm outdated --json       # majors only (table above)
npm run lint
npx tsc --noEmit
npm run test:unit
npm run build
npm run check:build       # tip #524 harness
git diff --name-only origin/cursor/integration-fold-wave5-tip-4af0
# expected: docs/dev/dependency-advisory-audit.md only
```

Results recorded in the PR body.
