# Dead-CSS Rank-1 rescan — tip post748

**Task id:** `q-mp-241` (P4 polish)  
**Tip base:** `cursor/mp-tip-post748` @ `ce673656` (`ce673656202db8a9eae4e3c404c55a680bb40cd0`)  
**Measured at:** `2026-10-09T20:30:00Z` (UTC)  
**Deliverable:** dated residual inventory + delete only verified-unused Rank-1 CSS leftovers (zero TS/HTML/script/test refs; no dynamic `classList` / template construction).

## Acceptance (from backlog q-mp-241)

- [x] Re-run CSS class scan equivalent to `scripts/report-dead-code.mjs` `scanCssClasses()`
- [x] Dated residual inventory under `docs/dev/`
- [x] Delete only selectors with **zero** TS/HTML/script/test refs and **no** dynamic construction
- [x] Update `dead-code-inventory.md` / `.json` dispositions
- [x] Dynamic families marked **kept/dynamic** (not deleted)
- [x] No player-facing copy / rules / AI edits; visual-baseline unaffected (removed rules never assigned)

## Duplicate check (open tip drafts)

| PR | Title | Overlap |
| --- | --- | --- |
| [#736](https://github.com/fuzzywigg/math-pentathlon/pull/736) | q-mp-211 `.move-history-panel` | Orthogonal — already removed on tip; different selector |
| [#690](https://github.com/fuzzywigg/math-pentathlon/pull/690) | q-mp-154 calla/sd CSS | Contained / folded topic |
| [#710](https://github.com/fuzzywigg/math-pentathlon/pull/710) | q-mp-176 `.game-card-division` | Contained / folded topic |
| [#749]–[#753](https://github.com/fuzzywigg/math-pentathlon/pulls) | emit-identity / demos / knip / backlog | Unrelated |

No open draft into `cursor/mp-tip-post748` owns a fresh Rank-1 CSS rescan.

## Method

1. Walk `src/**/*.css` for class selectors (same regex as `scripts/report-dead-code.mjs`).
2. Search corpus: `src/**/*.{ts,tsx,html}`, `tests/**/*.{ts,tsx,html,mjs}`, `scripts/**/*.{mjs,js,ts}`, `index.html`.
3. Flag classes with zero whole-token hits outside defining CSS.
4. Exclude known dynamic prefixes (`difficulty-*`, `star-track-path-*`, `occupied-*`, `owl-mood-*`, `phase-*`, …).
5. Manual `rg` proof before delete; leave any selector with script/e2e string refs.

## Live tip snapshot (pre-delete)

| Metric | Value |
| --- | ---: |
| CSS classes defined | 493 |
| Naive unused (no literal TS/HTML/test hit) | 10 |
| Zero-ref after including `scripts/` + excluding dynamics | **2** |

### Naive unused (10)

Class names are plain text (not `` `symbol` | `path` `` rows) so `check:dev-docs` does not treat CSS selectors as TS exports.

| CSS class | Disposition | Defining file |
| --- | --- | --- |
| difficulty-beginner | kept/dynamic — `difficulty-${game.difficulty}` in `src/ui/game-selector.ts` | src/style.css |
| difficulty-intermediate | kept/dynamic | src/style.css |
| difficulty-advanced | kept/dynamic | src/style.css |
| star-track-path-p1 | kept/dynamic — `star-track-path-${p1\|p2}` in `src/games/star-track/board-ui.ts` | src/ui/styles/game-play.css |
| star-track-path-p2 | kept/dynamic | src/ui/styles/game-play.css |
| par55-cell | kept — script refs in `scripts/runtime-perf.mjs`, `scripts/render-perf.mjs` | src/ui/styles/forced-colors.css |
| par55-turn-hint | kept — script ref in `scripts/par-55-deep-playtest.mjs` | src/games/par-55/par-55.css |
| ramrod-turn-hint | kept — script + e2e refs (`scripts/ramrod-deep-playtest.mjs`, tests/e2e/fullgame) | src/games/ramrod/ramrod.css |
| par55-btn-primary | removed (q-mp-241) | src/games/par-55/par-55.css |
| ramrod-btn-primary | removed (q-mp-241) | src/games/ramrod/ramrod.css |

### Dynamic families (do not delete)

These concrete CSS classes have no literal TS token hits but are applied via templates / `classList` construction:

- `difficulty-${game.difficulty}` → `.difficulty-beginner|intermediate|advanced`
- `star-track-path-${p1|p2}` → `.star-track-path-p1|p2`
- `occupied-${player}` → `.occupied-player1|player2` (juggle)
- `owl-mood-${mood}` → `.owl-mood-*` (game-play.css)
- `phase-${turnPhase}` → `.phase-gameOver` (and related)

## Verified removals (q-mp-241)

Leftovers from [#82](https://github.com/fuzzywigg/math-pentathlon/pull/82) (in-board New Game buttons moved to shared shell). Live controls assign only `*-btn-secondary`.

| Selector | Files touched | rg proof (post-delete) |
| --- | --- | --- |
| .par55-btn-primary (+ :hover, reduced-motion group) | src/games/par-55/par-55.css | hits only in this inventory / dead-code docs |
| .ramrod-btn-primary (+ :hover, reduced-motion group) | src/games/ramrod/ramrod.css | hits only in this inventory / dead-code docs |

Live chrome unchanged: Clear Selection / Pass Turn still use `.par55-btn-secondary` / `.ramrod-btn-secondary`.

## Post-delete zero-ref re-scan

After removals, excluding dynamic prefixes and counting `scripts/` + `tests/`:

- Zero-ref CSS classes remaining: **0**
- Prior Rank-1 rows (`game-card-division`, `calla-teaching-hint`, `sd-hands-container`, `move-history-panel`) still absent from `src/`

## Inventory sync

- `docs/dev/dead-code-inventory.md` — changelog + executed rows + ranked dispositions
- `docs/dev/dead-code-inventory.json` — `executedRemovalRows` + row dispositions for both symbols

## Reproduce

```bash
node scripts/report-dead-code.mjs   # full inventory rewrite (optional; this PR patched dispositions)
rg -n 'par55-btn-primary|ramrod-btn-primary' src tests scripts index.html
# → empty (docs-only hits remain under docs/dev/)
```
