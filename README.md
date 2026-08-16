# math-pentathlon

Twenty registered games. Live at https://math.pappas.work

There is **no Math Relay** in this tree. Do not invent one.

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
- CI unit passes
- e2e is continue-on-error and recently failed while the workflow stayed green

## Agent rules

- PRs target **alpha**, not main
- Scoring, deploys, and alpha to main promotions escalate (do not self-serve)
