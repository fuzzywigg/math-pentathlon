# math-pentathlon

Five competitive math games for elementary-school students, built as a browser-playable TypeScript/Vite app.

**Live:** [math.pappas.work](https://math.pappas.work)

## Games
| Game | Concept |
|---|---|
| **Contig 60** | Adjacency-based arithmetic board game |
| **Star Track** | Chain-and-bucket strategy game |
| **Hex** | Hexagonal grid connection game |
| **Kings & Quadraphages** | Capture-the-king variant |
| **Math Relay** | Timed arithmetic relay |

## Stack
- TypeScript + Vite
- Vitest (unit) + Playwright (e2e)
- Deployed via Cloudflare Pages

## Development
```bash
npm install
npm run dev        # local dev server
npm test           # unit tests (400 passing)
npm run test:e2e   # playwright e2e (requires built app)
npm run build      # production build → dist/
```

## Branches
- `alpha` — active trunk; all development merges here
- `main` — legacy; do not use for new work

## Status (2026-07-18)
- 400/400 unit tests passing
- Issues #4 (Contig 60 duplicates), #5 (Star Track stuck state), #6 (Hex offsets), #7 (Kings GameState) all fixed and merged
- Deployed to CF Pages via GitHub Actions on merge to `alpha`

## Agent rules
- Target branch for all PRs: `alpha` (not `main`)
- Run `npm test` before opening any PR
- E2E failures are non-blocking if unit tests pass (known flakiness in CI environment)
