# Visual regression (opt-in)

Playwright screenshot baselines for the **landing page** and each available game's **2D start/board** screen.

This suite is **opt-in** (`npm run test:visual`, via `playwright.visual.config.ts`). It is **not** a required CI check and is **not** invoked by `npm test` or `.github/workflows/ci.yml`.

A separate e2e visual suite (`npm run test:e2e:visual`, projects `visual-desktop` / `visual-phone`) **is** run in CI as report-only job `visual-baseline`. See [docs/wiki/development.md](./wiki/development.md#visual-regression-baselines).

## What it covers

| Capture | Route / setup |
| ------- | ------------- |
| Landing | `/#/` (full page) |
| Each game board | `/#/game/<id>` after human-vs-human start, classic **2D** DOM board |

## Determinism knobs

Configured in `playwright.visual.config.ts` and `tests/visual/helpers.ts`:

- **Browser:** Chromium only
- **Viewport:** fixed `1280×720`, `deviceScaleFactor: 1`
- **Seed:** `Math.random` replaced with Mulberry32 (`VISUAL_SEED`) before app scripts run, then **re-seeded immediately before Start Game** so owl/idle entropy cannot skew shuffles
- **Animations:** `reducedMotion: 'reduce'`, CSS kill-switch, Playwright `animations: 'disabled'`, caret hidden
- **3D off:** `localStorage` clears `mp-board3d` and URLs use `?board3d=0`
- **Ollie:** disabled in stored settings and hidden in CSS so the mascot does not animate into snapshots
- **Fresh start:** each game capture opens New Game → human-vs-human → Start (not the leftover mount board)

Baselines live in `tests/visual/__screenshots__/` (committed).

## Commands

```bash
# Install browsers once (chromium is enough for this suite)
npx playwright install chromium

# Compare against committed baselines
npm run test:visual

# Regenerate baselines after intentional UI changes
npm run test:visual:update
```

Both scripts use `playwright.visual.config.ts` (separate from the e2e `playwright.config.ts`).

## Update workflow

1. Make your UI/CSS change (no game rules / scoring changes needed for this suite).
2. Run `npm run test:visual` and inspect failures / the HTML report under `playwright-report/`.
3. If the new look is intentional, run `npm run test:visual:update`.
4. Review the git diff of `tests/visual/__screenshots__/*.png` — only expected pixels should change.
5. Commit the updated PNGs with the UI change.
6. Open a PR. Reviewers look at the image diff; CI does **not** block on visual results.

## When to update baselines

Update when you intentionally change:

- Landing layout, typography, or game-card chrome
- Shared shell / board chrome visible at game start
- 2D board rendering for a specific game

Do **not** update to silence flakes — fix determinism (seed, motion, owl, fonts) first.

## Out of scope

- 3D (`board3d`) canvases — see existing `tests/e2e/mp3d-*.spec.ts` evidence screenshots
- Multi-browser / mobile viewports (keep the suite cheap and stable)
- Required CI gating
