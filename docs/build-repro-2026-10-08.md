# Build reproducibility & Vite/PWA config audit — 2026-10-08

Task: `burn-1008-mp-build-repro`  
Base tip: `cursor/integration-fold-wave5-tip-4af0` (#477)

**Draft only.** No game / AI / copy changes. Build-config + report script only.

## Overlap (intentionally not duplicated)

| Open draft | Scope | Relation |
| --- | --- | --- |
| #455 bundle budget | `size:check` gzip budgets | Different — size, not reproducibility |
| #489 load perf | menu chunk trim + `check:perf` | Different — runtime load; may touch `vite.config.ts` chunk policy already on tip |
| #458 offline resilience | docs + chunk-load retry | Different — runtime offline UX |
| #479 WebKit offline PWA | idle-warm route mounts | Different — WebKit SW fetch quirk |

## Nondeterminism sources found

| Source | Status | Fix (build config only) |
| --- | --- | --- |
| Workbox precache **entry order** (filesystem `readdir` / glob order) | Risk — can make `sw.js` byte-differ when file set is identical | `workbox.manifestTransforms` sorts by `url` |
| Sourcemap absolute paths | Default was already off; unset policy was implicit | Explicit `build.sourcemap: false` |
| esbuild legal / license comment variance | Vite already used `legalComments: 'none'` | Explicit `esbuild.legalComments: 'none'` |
| Base-path drift vs absolute HTML/manifest URLs | Default `base: '/'` matched hosting | Explicit `base: '/'` + audit in `check:build` |
| Content hashes / `manualChunks` names | Already stable on tip (two clean builds matched) | Kept `[name]-[hash]` + existing `manualChunks` |
| Timestamps / `SOURCE_DATE_EPOCH` / `TZ` | Not observed in dist (rebuild with altered env still identical) | No further change |
| Absolute `/workspace` or `/home` path leakage | Not found in JS/CSS/HTML | Guarded by `check:build` scan |
| Unstable Rollup auto chunk ids | Not observed (demos/workers kept stable names across dual builds) | No change (assigning more `manualChunks` would overlap #489) |
| Env leakage (`import.meta.env.DEV`) | Vite replaces/strips; no residual `import.meta.env` in dist | No change |
| Dev-only / test fixtures in dist | No `tests/` paths. `/demo/*` chunks are production educational routes. MP3D `window.__mp3d*` hooks are game-code test harnesses (out of scope) | Report-only note |

## Precache / offline audit (tip build)

- Precache entries: **76** (every URL exists under `dist/`).
- Offline-needed assets (globPatterns minus intentional font ignores and deploy meta): **all precached**.
- Intentionally **not** precached: Inter 500/600/700 (`runtimeCaching` CacheFirst), `_headers`, `_redirects`, `sw.js`, `workbox-*.js`.
- `CNAME` is `includeAssets`'d (tiny DNS helper file); not required for offline play.
- Sourcemaps: **0** `.map` files in dist.
- Base path: `index.html` asset URLs and `site.webmanifest` `start_url` / `scope` / icon `src` are root-absolute (`/…`), matching `base: '/'`.

## How to verify

```bash
npm run build
npm run check:build          # two clean builds + diffs + precache; always exit 0
npx tsc --noEmit
npm run test:unit
```

Report artifact: `test-results/build/summary.md` (+ `summary.json`, `dist-a/`, `dist-b/`).

Skip rebuilds when snapshots already exist:

```bash
CHECK_BUILD_SKIP_BUILD=1 npm run check:build
```

## Files touched

| Path | Role |
| --- | --- |
| `vite.config.ts` | Explicit base/sourcemap/legalComments; sorted precache manifest |
| `scripts/check-build.mjs` | Dual-build diff + precache/base/leak audit (report-only) |
| `package.json` | `npm run check:build` |
| `tests/unit/check-build-helpers.test.ts` | Unit coverage for parsers/diff helpers |
| `docs/build-repro-2026-10-08.md` | This audit |
