# math-pentathlon

[![CI](https://github.com/fuzzywigg/math-pentathlon/actions/workflows/ci.yml/badge.svg?branch=alpha)](https://github.com/fuzzywigg/math-pentathlon/actions/workflows/ci.yml)
[![Deploy](https://github.com/fuzzywigg/math-pentathlon/actions/workflows/deploy.yml/badge.svg?branch=alpha)](https://github.com/fuzzywigg/math-pentathlon/actions/workflows/deploy.yml)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
[![npm audit](https://img.shields.io/badge/npm%20audit-%E2%89%A5%20high-informational)](https://github.com/fuzzywigg/math-pentathlon/blob/alpha/.github/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-Vitest%20%2B%20Playwright-informational)](https://github.com/fuzzywigg/math-pentathlon/blob/alpha/.github/workflows/ci.yml)

Twenty registered games. Live at https://math.pappas.work

There is **no Math Relay** in this tree. Do not invent one.

## Wiki

Public learning-game wiki (in-repo): [docs/wiki](./docs/wiki/README.md) — Overview, Games, Big Toads, Development, Accessibility, Roadmap.

## Games

Names from src/core/game-registry.ts:

1. Kings & Quadraphages
2. Hex
3. Star Track
4. Hex-a-Gone!
5. Calla
6. Sum Dominoes & Dice
7. Par 55
8. Ramrod
9. Kwatro-Sinko
10. FIAR
11. Juggle
12. Contig 60
13. Stars & Bars
14. Fab-a-Diffy
15. Queens & Guards
16. Prime Gold
17. Remainder Islands
18. Pent'Em In
19. Frac Fact
20. Fraction Pinball

## Gallery

Tablet landscape (1024×768) start and mid-game screenshots for every registered game. Regenerated with Playwright (not CI):

```bash
npx playwright test -c playwright.gallery.config.ts
```

| Game | Start | Mid-game |
|------|-------|----------|
| Kings & Quadraphages | [start](./docs/gallery/kings-quadraphages-start.png) | [mid](./docs/gallery/kings-quadraphages-mid.png) |
| Hex | [start](./docs/gallery/hex-start.png) | [mid](./docs/gallery/hex-mid.png) |
| Star Track | [start](./docs/gallery/star-track-start.png) | [mid](./docs/gallery/star-track-mid.png) |
| Hex-a-Gone! | [start](./docs/gallery/hex-a-gone-start.png) | [mid](./docs/gallery/hex-a-gone-mid.png) |
| Calla | [start](./docs/gallery/calla-start.png) | [mid](./docs/gallery/calla-mid.png) |
| Sum Dominoes & Dice | [start](./docs/gallery/sum-dominoes-start.png) | [mid](./docs/gallery/sum-dominoes-mid.png) |
| Par 55 | [start](./docs/gallery/par-55-start.png) | [mid](./docs/gallery/par-55-mid.png) |
| Ramrod | [start](./docs/gallery/ramrod-start.png) | [mid](./docs/gallery/ramrod-mid.png) |
| Kwatro-Sinko | [start](./docs/gallery/kwatro-sinko-start.png) | [mid](./docs/gallery/kwatro-sinko-mid.png) |
| FIAR | [start](./docs/gallery/fiar-start.png) | [mid](./docs/gallery/fiar-mid.png) |
| Juggle | [start](./docs/gallery/juggle-start.png) | [mid](./docs/gallery/juggle-mid.png) |
| Contig 60 | [start](./docs/gallery/contig-60-start.png) | [mid](./docs/gallery/contig-60-mid.png) |
| Stars & Bars | [start](./docs/gallery/stars-bars-start.png) | [mid](./docs/gallery/stars-bars-mid.png) |
| Fab-a-Diffy | [start](./docs/gallery/fab-a-diffy-start.png) | [mid](./docs/gallery/fab-a-diffy-mid.png) |
| Queens & Guards | [start](./docs/gallery/queens-guards-start.png) | [mid](./docs/gallery/queens-guards-mid.png) |
| Prime Gold | [start](./docs/gallery/prime-gold-start.png) | [mid](./docs/gallery/prime-gold-mid.png) |
| Remainder Islands | [start](./docs/gallery/remainder-islands-start.png) | [mid](./docs/gallery/remainder-islands-mid.png) |
| Pent'Em In | [start](./docs/gallery/pent-em-in-start.png) | [mid](./docs/gallery/pent-em-in-mid.png) |
| Frac Fact | [start](./docs/gallery/frac-fact-start.png) | [mid](./docs/gallery/frac-fact-mid.png) |
| Fraction Pinball | [start](./docs/gallery/fraction-pinball-start.png) | [mid](./docs/gallery/fraction-pinball-mid.png) |

See also [docs/gallery/README.md](./docs/gallery/README.md).

## Stack

- TypeScript + Vite
- Vitest (unit) + Playwright (e2e)
- Cloudflare Pages, deployed from alpha

## Development

```bash
npm install                 # Node.js >= 20
npm run dev                 # Vite → http://localhost:5173
npm test                    # unit then Chromium e2e (CI required pair)
npm run test:unit
npm run test:e2e:chromium   # required CI e2e path
npm run lint
npm run format:check
npm run build
npm run preview             # serve dist/ after build
```

`npm test` runs `test:unit` then `test:e2e:chromium`. Prefer `test:e2e:chromium` over bare `npm run test:e2e` (the latter runs every Playwright project). The unit suite under `tests/unit` is sized for CI under ~8 minutes (see `docs/wiki/development.md`).

Contributor checklist: [CONTRIBUTING.md](./CONTRIBUTING.md). Full scripts (coverage, visual, mobile, size budgets, perf audits): [docs/wiki/development.md](./docs/wiki/development.md).

## Branches

- alpha -- trunk. All development merges here.
- main -- `317` behind / `2` ahead of alpha (`origin/main...origin/alpha` as of 2026-10-07). Do not target main for new work.

## Status (2026-10-07)

- 20 registered games in `src/core/game-registry.ts` (all `available: true`)
- Tests: 3057 Vitest files under `tests/unit` (excl. `_tokenmaxx_archive`) + 34 Playwright specs under `tests/e2e` (visual baselines in `tests/e2e/visual-baselines/`)
- CI (`ci.yml`): lint, Prettier `format:check`, `tsc --noEmit`, `npm audit --audit-level=high`, build (+ hard 250 kB JS chunk budget; report-only `size:check`), unit (required), Chromium e2e (required); report-only `mobile-touch`, `e2e-cross-browser`, and `visual-baseline` (see `docs/wiki/development.md`)
- `origin/alpha` is the trunk tip; the integration tip may be ahead of alpha.

## Agent rules

- PRs target **alpha**, not main
- Scoring, deploys, and alpha to main promotions escalate (do not self-serve)
