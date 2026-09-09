# math-pentathlon

[![CI](https://github.com/fuzzywigg/math-pentathlon/actions/workflows/ci.yml/badge.svg?branch=alpha)](https://github.com/fuzzywigg/math-pentathlon/actions/workflows/ci.yml)
[![Deploy](https://github.com/fuzzywigg/math-pentathlon/actions/workflows/deploy.yml/badge.svg?branch=alpha)](https://github.com/fuzzywigg/math-pentathlon/actions/workflows/deploy.yml)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)
[![npm audit](https://img.shields.io/badge/npm%20audit-%E2%89%A5%20high-informational)](https://github.com/fuzzywigg/math-pentathlon/blob/alpha/.github/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-Vitest%20%2B%20Playwright-informational)](https://github.com/fuzzywigg/math-pentathlon/blob/alpha/.github/workflows/ci.yml)

Twenty registered games. Live at https://math.pappas.work

There is **no Math Relay** in this tree. Do not invent one.

<!-- TODO(#30): Public wiki outline (Overview, Games, Big Toads, Development, Accessibility, Roadmap) remains for HITL — deferred from this README-badges PR. -->

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

## Stack

- TypeScript + Vite
- Vitest (unit) + Playwright (e2e)
- Cloudflare Pages, deployed from alpha

## Development

npm install
npm run dev
npm test             # unit + e2e
npm run test:unit
npm run test:e2e
npm run build

`npm test` runs unit then e2e. HEAD has **417 unit tests**.

## Branches

- alpha -- trunk. All development merges here.
- main -- 45 behind / 2 ahead of alpha. Do not target main for new work.

## Status (2026-08-16)

- Issues #4-#7 merged
- CI unit passes (job still continue-on-error for tracked alpha gaps)
- CI e2e failures fail the workflow (see #48)

## Agent rules

- PRs target **alpha**, not main
- Scoring, deploys, and alpha to main promotions escalate (do not self-serve)
