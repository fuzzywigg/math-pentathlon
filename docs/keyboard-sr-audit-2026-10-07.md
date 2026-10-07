# Keyboard + screen-reader audit — 2026-10-07

Scope: **2D mode** for all 20 available practice games.  
Methods: keyboard-only playthrough (Tab / Enter / Space / arrows), screen-reader semantics pass (roles, labels, live regions for turn / score / win), and Chromium Playwright keyboard e2e.  
Constraints: **no rules or scoring changes**.

Shared helpers: `src/ui/board-a11y.ts` (`buildCellAriaLabel`, grid/roving keys, `markStatusLive`).  
Shell chrome: `src/ui/components/game-shell.ts`.

## Cross-cutting findings (fixed this pass)

| Issue | Severity | Fix |
| --- | --- | --- |
| New Game / Help modals had no `role="dialog"` / `aria-modal`, did not move focus in, and **Tab escaped** into the board / owl | High | Focus trap + dialog semantics + restore focus on close/Escape in `game-shell.ts` |
| Board `gridcell` / SVG `role="button"` relied on browser default outlines (weak/inconsistent, especially SVG `<g>`) | Medium | Global `:focus-visible` rings in `src/style.css` for board targets + common game controls |
| Calla invalid/opponent pits were `tabindex="0"` with `aria-disabled` (extra tab stops / focus clutter) | Medium | Only valid pits are keyboard buttons; others keep `aria-label` only |
| Fraction Pinball choice buttons lacked explicit `aria-label` (name from text only) | Low | `aria-label="Answer …"` aligned with Frac Fact |

## Per-game matrix (2D)

Legend: **KB** = keyboard play works for a full human action; **Grid** = ARIA grid + arrows; **Live** = polite `role="status"` for turn/score/win; **Labels** = interactive targets named (not color-only).

| Game | KB | Grid / pattern | Live status | Labels | Notes / residual |
| --- | --- | --- | --- | --- | --- |
| Kings & Quadraphages | Yes | Grid + arrows | Yes | Yes (valid move/placement) | Focus restored after rebuild |
| Hex | Yes | Grid + arrows | Yes | Yes (valid placement) | |
| Star Track | Yes | Native buttons | Yes | Draw/chain labeled | Decorative track SVG not a grid (OK) |
| Hex-a-Gone! | Yes | Grid + arrows | Yes | Cells + bank buttons | Confirm path keyboard-reachable |
| Calla | Yes | Button pits (valid-only tab stops) | Yes | Valid move in label | Stores remain non-interactive |
| Sum Dominoes | Yes | Grid + hand buttons | Yes | Hand focus-visible already | Roll/pass have focus rings |
| Par 55 | Yes | Grid + hand | Yes | Yes | |
| Ramrod | Yes | Grid + rods | Yes | Yes | |
| Kwatro-Sinko | Yes | Grid nodes | Yes | Selectable / valid | |
| FIAR | Yes | Grid nodes | Yes | Selectable / valid move | |
| Juggle | Yes | Dual grids + roll | Yes | AI-seat honesty labels | |
| Contig 60 | Yes | Grid + roll/pass | Yes | Valid cells named | |
| Stars & Bars | Yes | Grid + cards | Yes | Yes | |
| Fab-a-Diffy | Yes | Bars + ops | Yes | Yes | |
| Queens & Guards | Yes | Grid | Yes | Valid move | |
| Prime Gold | Yes | Grid + roll | Yes | Valid placement | |
| Remainder Islands | Yes | SVG buttons on valid islands | Yes | Value/chips/valid | Roll phase: no island tab stops (expected) |
| Pent'Em In | Yes | Grid + piece bank | Yes | Yes | |
| Frac Fact | Yes | Native choice buttons | Yes | `Answer n/d` | SVG fractions need labels (present) |
| Fraction Pinball | Yes | Native choice buttons | Yes | `Answer …` (added) | |

## Screen-reader semantics checklist

For each game in human 2D mode after Start:

1. At least one `[role="status"][aria-live="polite"]` announces turn / phase (and win / draw when over).
2. Board interactives expose `role="gridcell"` or `role="button"` (or native `<button>`) with an accessible name including empty/owner and valid move/placement when applicable.
3. Computer seat does not advertise false “valid placement/move” affordances (existing AI-seat guards retained).
4. Shell modals are `role="dialog"` + `aria-modal="true"` with `aria-labelledby` pointing at the modal `h2`.

## Playwright coverage

New: `tests/e2e/keyboard-only.spec.ts` (Chromium project).

- Modal Tab trap (Hex shell)
- Kings (arrow + Enter move/place)
- Hex (Enter place)
- Star Track (Enter draw + chain)
- Calla (invalid not tabbable; Enter valid pit)
- Contig 60 (Enter roll + place/pass)
- Frac Fact (labeled Enter answer + Continue)

Unit keepers: `tests/unit/keyboard-sr-modal-focus-trap.test.ts`, board focus-visible assertion in `a11y-shell-menu-keepers.test.ts`, Calla/Pinball polish updates.

## Out of scope / escalate

- 3D canvas boards (separate a11y mirrors already exist under `src/ui/three/`)
- Scoring / engine / win-condition changes (`AGENTS.md` escalate)
- Full WCAG certification or VDOM rebuild (#11)
- Private accommodation workflows

## How to re-run

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npx playwright test --project=chromium tests/e2e/keyboard-only.spec.ts
```
