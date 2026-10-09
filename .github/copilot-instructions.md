# Copilot / AI Coding Instructions for Math Pentathlon

This file contains focused, actionable guidance to help an AI coding agent be productive in this repository.

Summary (big picture)
- **Frontend single-page app** built with `vite` + TypeScript. Entry: `src/main.ts`.
- **Domain logic lives under** `src/core` and `src/games`. UI rendering lives under `src/games/*/board-ui.ts` and `src/ui`.
- **Separation of concerns:** game rules and state are pure, testable functions (see `src/games/kings-quadraphages/game-state.ts` and `src/games/kings-quadraphages/rules.ts`). UI files call into those pure functions.

Key files and patterns to inspect
- `src/games/kings-quadraphages/game-controller.ts` — wiring between DOM and the pure game state.
- `src/games/kings-quadraphages/game-state.ts` — canonical example of state shape, turn lifecycle, and helpers (`toIndex`/`toPosition`, 1-based positions).
- `src/games/kings-quadraphages/rules.ts` — rules engine separate from UI/state mutation; prefer calling rules functions rather than re-implementing logic.
- `src/core/dice/roller.ts` — example of utility library: pure functions for dice rolling, selections, and derived combinatorics.
- Tests: unit tests under `tests/unit` use `vitest`+`jsdom`. E2E tests under `tests/e2e` use Playwright and expect a dev server.

Draft PR into tip
- Target **`cursor/mp-tip-post477`** as a **draft** PR. Do not merge, mark ready, or push to `alpha` / `main` / the tip branch. Tip owner folds; end PR bodies with `Next action: fold into tip by the tip owner`.
- Scan open tip drafts before starting; if covered, comment `superseded` / `contained` — do not close other PRs.

Developer workflows (commands)
- Start dev server: `npm run dev` (Vite, serves on `http://localhost:5173`).
- Build: `npm run build` (runs `tsc` then `vite build`); preview with `npm run preview`. After build: hard CI chunk budget is 250 kB per JS file under `dist/assets`; report-only gzip budgets via `npm run size:check`; report-only PWA contract via `npm run check:pwa-manifest`.
- Unit tests: `npm run test:unit` (or `npm run test:unit:watch`).
- Coverage: `npm run test:unit:coverage`.
- E2E (required CI path): `npm run test:e2e:chromium`. Bare `npm run test:e2e` runs **every** Playwright project — prefer an explicit script. Playwright config starts a web server with `npm run dev` and uses `http://localhost:5173` as `baseURL`.
- Full test shortcut: `npm test` (= unit then Chromium e2e).
- **CI lint-job chain:** `npm run verify` (= `lint` → `lint:ratchet` → `format:check` → `typecheck` → `typecheck:ratchet` → `check:boundaries`). Matches `.github/workflows/ci.yml` job `lint`.
- Lint alone: `npm run lint`; ceilings: `npm run lint:ratchet` (ratchet only goes down); format write: `npm run format`; CI format gate: `npm run format:check`.
- Types: `npm run typecheck` (not bare `npx tsc`); shell/Phase-2 ceilings: `npm run typecheck:ratchet`; import-graph: `npm run check:boundaries` (`engine_imports_ui` must stay 0).
- Emit identity (type-only / brace-only proofs; not an npm script): `node scripts/check-emit-identity.mjs`.
- Copy pins (report-only): `npm run check:copy-pins`. Prefer structural asserts; do not pin player-facing copy / phase messages. Do not add asserts that lock AI search, scoring, difficulty, or move timing. Hex Hard stays **450ms** with real time; no Stars & Bars history cap.
- CI posture (blocking vs report-only jobs): `AGENTS.md`, `docs/dev/ci-gates-mermaid-q-mp-073.md`. Workflow keeps `permissions: contents: read` and checkout `persist-credentials: false`.
- Full script list: `docs/wiki/development.md` and `CONTRIBUTING.md`.

Project-specific conventions and notes
- Positions: game board positions are 1-based in public APIs (rows/cols 1..9) — internal board arrays are 0-based. Use `toIndex`/`toPosition` helpers in `game-state.ts` when interacting with rules code.
- Board size: the `kings-quadraphages` game uses a 9x9 board — many utilities assume this constant.
- State immutability: mutation is avoided in core state updates — functions return new `GameState` objects (see `moveKing`, `placeQuadraphage`). Follow this pattern when adding logic.
- UI vs logic: keep DOM manipulation inside `*-ui.ts` or `game-controller.ts`. Rules and state functions must not access DOM directly to keep unit tests deterministic.
- Move history: `moveHistory` entries are appended immutably. Use the `MoveHistoryEntry` shape from `game-state.ts`.
- Dice randomness: `src/core/dice/roller.ts` currently uses `Math.random()` (non-crypto). If you need reproducible tests, mock or inject randomness.

Testing and debugging tips
- Unit tests use `vitest` with `jsdom` (see `vitest.config.ts`). Import and test pure functions directly (e.g., `moveKing`, `isValidPlacement`).
- Use exported helpers like `getGameState()` in `game-controller.ts` for interactive debugging in the browser console.
- E2E tests expect the app running at `http://localhost:5173`. Playwright config will launch `npm run dev` automatically when `reuseExistingServer` is false (CI).

When adding a new game module
1. Create `src/games/<your-game>/game-state.ts` for the state shape and pure state transitions.
2. Add `rules.ts` that accepts simple plain objects (no DOM) and returns validation/win info.
3. Add `board-ui.ts` for DOM rendering and `game-controller.ts` for wiring events -> state transitions.
4. Add unit tests under `tests/unit` for state and rules; add Playwright tests to `tests/e2e` only when UI interactions are stable.

Examples to reference in code
- Use `moveKing` and `placeQuadraphage` in `src/games/kings-quadraphages/game-state.ts` as templates for turn-based transitions.
- See `src/core/dice/roller.ts` for pure utility function style and return shapes like `DiceRollResult`.
- See `src/games/kings-quadraphages/ai.ts` for minimax-based AI opponent with configurable difficulty.
- See `src/games/kings-quadraphages/serialization.ts` for game state save/load functionality.

New features (recently added)
- **AI opponent** (`src/games/kings-quadraphages/ai.ts`): Minimax with alpha-beta pruning, 3 difficulty levels (easy, medium, hard). Uses position evaluation based on mobility, center control, and corner trapping.
- **Game state serialization** (`src/games/kings-quadraphages/serialization.ts`): Save/load game state to JSON. Includes version control, validation, and metadata support.
- **Game options module** (`src/games/kings-quadraphages/game-options.ts`): Configuration for game modes (PvP, vs AI), timer settings, and player configuration.
- **Barrel exports** (`src/games/kings-quadraphages/index.ts`): Clean public API for the entire game module.

Notes for the AI agent
- Prefer changing core logic in small, focused commits; follow existing immutable-state patterns.
- Avoid introducing DOM calls into `src/core` or `src/games/*/rules.ts` — keep those files side-effect free.
- Before opening or updating a tip draft, run `npm run verify` then `npm run test:unit` (and `npm run test:e2e:chromium` / `npm run build` as needed). Script names must exist in `package.json`.
- Do not change AI search/scoring/difficulty/timing, player-facing copy, or `*/rules.ts` legal-move / scoring paths unless a human escalates.

If anything in this guidance is unclear or you want more detail (specific file examples, additional patterns, or automated PR templates), tell me which area to expand.
