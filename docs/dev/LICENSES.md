# License & SBOM reporting

**Task:** `burn-1008-mp-license-sbom`  
**Command:** `npm run report:licenses`

## What it does

`scripts/report-licenses.mjs` reads `package-lock.json` (no new runtime
dependencies) and writes:

| Artifact | Location |
| --- | --- |
| CycloneDX 1.5 SBOM | `test-results/licenses/sbom.cdx.json` |
| Human summary | `test-results/licenses/summary.md` |
| Machine summary | `test-results/licenses/summary.json` |

It also inventories bundled `public/` fonts, icons, and images (no sounds in
this repo) and prints license counts for production vs CI/dev packages.

## Exit policy

| Condition | Exit |
| --- | --- |
| Report completed; no denied licenses | `0` (report-only) |
| Explicitly denied license in the lockfile tree | `1` |
| Missing / unreadable lockfile | `1` |

Copyleft (e.g. MPL-2.0), unusual SPDX ids (e.g. Python-2.0), unknown/missing
licenses, and `hasInstallScript` packages are **flagged for owner review** but
do **not** fail the report.

### Denied (fail)

AGPL, GPL-2.0, GPL-3.0, SSPL, BUSL, Commons Clause, CPAL.

### Flagged (report-only)

MPL-2.0, LGPL, EPL, CDDL, EUPL, OSL, Python-2.0, UNKNOWN / UNLICENSED /
missing, install scripts.

## Shipping notices

Runtime third-party notices for the built app live in repo-root
`THIRD_PARTY_NOTICES` (three.js MIT + Inter OFL-1.1). First-party favicons /
PWA icons are called out there as original artwork.

Vendored Inter (OFL-1.1) paths:

- `public/fonts/inter-latin-400-normal.woff2`
- `public/fonts/inter-latin-500-normal.woff2`
- `public/fonts/inter-latin-600-normal.woff2`
- `public/fonts/inter-latin-700-normal.woff2`

## Owner decisions (accepted — no action)

Flagged items from the final-tip `report:licenses` run are **dev/CI only** and
accepted with no further action:

| Package | License / note | Scope |
| --- | --- | --- |
| `@axe-core/playwright`, `axe-core` | MPL-2.0 | dev/CI |
| `argparse` | Python-2.0 | dev/CI |
| `esbuild`, `fsevents` | MIT + install scripts | dev/CI (fsevents optional) |

**Production dependency:** only `three` (MIT). Nothing for Andrew on the
shipping license surface.

## Final tip snapshot (post-#512 / lockfile peers)

Re-run on tip SHA after later folds (`npm run report:licenses`):

- Packages: **585** (production **1**, development **584**)
- Production licenses: MIT ×1 (`three`)
- SBOM / summaries stay under gitignored `test-results/licenses/`
- Not wired into required CI (`check:workflows` / `ci.yml` have no
  `report:licenses` gate; stays out unless a later contract adds it report-only)

## Related work (do not duplicate)

- Dependency hygiene / audit / deferred majors: #512 (`docs/dev/DEPENDENCIES.md`)
- Build reproducibility / PWA precache: #524 (`check:build`)
