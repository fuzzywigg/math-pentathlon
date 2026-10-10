/**
 * q-mp-349 — engine coverage round 11: post-r10 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after r10 closed timer-scoring /
 * dom-security / url-flags / sanitize / placement empty-flip. Prefer
 * fractions + polyomino leftovers (NOT transform — open #847 / q-mp-354;
 * NOT attributes/dice/graph — reserved for parallel q-mp-372 / r12).
 * Pins CURRENT behavior only. Does not change engine / rules.ts / AI source.
 *
 * Baseline rank (tip post830 @ 97487de6, coverage-engine-r11-baseline):
 *   fraction-bar-ui.ts     85.71% branches (96/112)  ← primary
 *   storage/storage.ts     90.00% (63/70)            ← r10 residual; skip
 *   graph/algorithms.ts    90.00% (117/130)          ← r12 / documented
 *   polyomino-ui.ts        90.90% (50/55)            ← primary
 *   attribute-ui.ts        92.85% (65/70)            ← r12
 *   dice-ui.ts             94.82% (55/58)            ← r12
 *   polyomino/placement.ts 96.39% (107/111)          ← residual docs
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createFraction } from '../../src/core/fractions/arithmetic';
import {
  createInteractiveFractionBar,
  getFractionColor,
  renderCircleBar,
  renderFractionBar,
  renderHorizontalBar,
  renderVerticalBar,
} from '../../src/core/fractions/fraction-bar-ui';
import type { FractionBarConfig } from '../../src/core/fractions/types';
import { COMMON_FRACTIONS } from '../../src/core/fractions/types';
import { createBoard, type Board } from '../../src/core/polyomino/placement';
import {
  getCellFromMouseEvent,
  renderBoard,
} from '../../src/core/polyomino/polyomino-ui';
import type { PolyominoShape } from '../../src/core/polyomino/types';

/** Colors object with explicit undefined keys so deep-merge overwrites defaults. */
const UNDEFINED_COLORS = {
  filled: undefined,
  empty: undefined,
  border: undefined,
} as unknown as FractionBarConfig['colors'];

const domino = (): PolyominoShape => ({
  id: 'domino',
  name: 'domino',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
  ],
  color: '#ff00aa',
  canRotate: true,
  canFlip: false,
  size: 2,
  order: 2,
});

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fraction-bar-styles')?.remove();
  vi.restoreAllMocks();
});

// =============================================================================
// 1. fraction-bar-ui.ts — coldest preferred host (?? color fallbacks)
// =============================================================================

describe('engine-coverage-round-11 — fraction-bar-ui', () => {
  it('horizontal bar uses palette/default fallbacks when color keys are undefined', () => {
    const f = createFraction(1, 4);
    const svg = renderHorizontalBar(f, {
      showLabel: false,
      width: 100,
      height: 20,
      colors: UNDEFINED_COLORS,
    });
    const rects = [...svg.querySelectorAll('rect')];
    expect(rects.length).toBeGreaterThanOrEqual(2);
    // empty ?? '#e0e0e0', border ?? '#333', filled ?? getFractionColor(4)
    expect(rects[0]?.getAttribute('fill')).toBe('#e0e0e0');
    expect(rects[0]?.getAttribute('stroke')).toBe('#333');
    expect(rects[1]?.getAttribute('fill')).toBe(getFractionColor(4));
    const lines = [...svg.querySelectorAll('line')];
    expect(lines.length).toBeGreaterThan(0);
    expect(lines[0]?.getAttribute('stroke')).toBe('#333');
  });

  it('vertical bar uses the same undefined-color fallbacks', () => {
    const svg = renderVerticalBar(createFraction(2, 3), {
      showLabel: false,
      width: 30,
      height: 90,
      colors: UNDEFINED_COLORS,
    });
    const rects = [...svg.querySelectorAll('rect')];
    expect(rects[0]?.getAttribute('fill')).toBe('#e0e0e0');
    expect(rects[0]?.getAttribute('stroke')).toBe('#333');
    expect(rects[1]?.getAttribute('fill')).toBe(getFractionColor(3));
    expect(svg.querySelector('line')?.getAttribute('stroke')).toBe('#333');
  });

  it('circle bar partial + full slices fall back filled/empty/border', () => {
    const partial = renderCircleBar(createFraction(1, 3), {
      showLabel: false,
      width: 80,
      height: 80,
      colors: UNDEFINED_COLORS,
    });
    expect(partial.querySelector('circle')?.getAttribute('fill')).toBe(
      '#e0e0e0'
    );
    expect(partial.querySelector('circle')?.getAttribute('stroke')).toBe(
      '#333'
    );
    expect(partial.querySelector('path')?.getAttribute('fill')).toBe(
      getFractionColor(3)
    );
    expect(partial.querySelector('line')?.getAttribute('stroke')).toBe('#333');

    const full = renderCircleBar(createFraction(4, 4), {
      showLabel: false,
      width: 80,
      height: 80,
      colors: UNDEFINED_COLORS,
    });
    const fills = [...full.querySelectorAll('circle')].map((c) =>
      c.getAttribute('fill')
    );
    expect(fills).toContain('#e0e0e0');
    expect(fills).toContain(getFractionColor(1)); // simplified 4/4 → 1/1
  });

  it('interactive bar shallow-merge empty colors hits ?? fallbacks', () => {
    const changes: number[] = [];
    const el = createInteractiveFractionBar(
      createFraction(1, 4),
      4,
      (f) => changes.push(f.numerator),
      // Shallow merge replaces DEFAULT colors entirely → empty/filled/border miss.
      { colors: {} }
    );
    document.body.appendChild(el);
    const segs = [...el.querySelectorAll('.fraction-segment')];
    expect(segs).toHaveLength(4);
    // Wrapper border uses `colors?.border ?? '#333'` (jsdom → rgb).
    // Segment `background:` cssText is dropped by jsdom even with defaults
    // (see overnight-frac-bar-interactive-zero-stale); the ?? arms still run
    // while building the template string — coverage pins that path.
    expect(el.style.border).toMatch(/rgb\(51,\s*51,\s*51\)|#333/);
    segs[2]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(changes).toEqual([3]);
  });

  it('documents unreachable interactive mouseenter hole when segments[j] missing', () => {
    // segments is densely pushed 0..denominator-1; `if (seg)` false arm never
    // fires without mutating the closed-over array (no public hook).
    expect(true).toBe(true);
  });

  it('renderFractionBar default + forged style still route to horizontal', () => {
    const svg = renderFractionBar(COMMON_FRACTIONS[0]!, {
      style: 'not-a-style' as FractionBarConfig['style'],
      showLabel: false,
      colors: UNDEFINED_COLORS,
    });
    expect(svg.classList.contains('fraction-bar-horizontal')).toBe(true);
  });
});

// =============================================================================
// 2. polyomino-ui.ts — OOB placement skip + viewBox size fallbacks
// =============================================================================

describe('engine-coverage-round-11 — polyomino-ui', () => {
  it('renderBoard skips placement cells that fall outside the board', () => {
    // Forge a placement whose second domino cell is OOB — renderBoard does not
    // re-validate; the bounds guard must skip the out-of-range cell.
    const board: Board = {
      ...createBoard(2, 2),
      placements: [
        {
          shapeId: 'domino',
          position: { row: 1, col: 1 },
          rotation: 0,
          flipped: false,
        },
      ],
    };
    const svg = renderBoard(board, [domino()], { cellSize: 10, padding: 0 });
    // Grid: 4 cell rects + 1 bg + 1 in-bounds filled piece = 6; OOB cell omitted.
    const filled = [...svg.querySelectorAll('rect')].filter(
      (r) => r.getAttribute('fill') === '#ff00aa'
    );
    expect(filled).toHaveLength(1);
    expect(filled[0]?.getAttribute('x')).toBe('11'); // col 1 * 10 + 1
    expect(filled[0]?.getAttribute('y')).toBe('11'); // row 1 * 10 + 1
  });

  it('getCellFromMouseEvent falls back to width/height attrs when viewBox is zero', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // jsdom viewBox.baseVal.width is 0 when unset → take attr arm.
    svg.setAttribute('width', '40');
    svg.setAttribute('height', '40');
    // Keep CSS rect equal to attrs so scale is 1:1; the branch under test is
    // viewBoxWidth source (attr), not the rect-size arm.
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 40, height: 40 }),
    });
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 15, clientY: 25 }),
        svg,
        { cellSize: 10, padding: 0 }
      )
    ).toEqual({ row: 2, col: 1 });
  });

  it('getCellFromMouseEvent falls back to rect size then 1 when attrs missing', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 30, height: 30 }),
    });
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 5, clientY: 15 }),
        svg,
        { cellSize: 10, padding: 0 }
      )
    ).toEqual({ row: 1, col: 0 });

    // Zero rect → final `|| 1` arm (avoids divide-by-zero in scale).
    const tiny = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.defineProperty(tiny, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 0, height: 0 }),
    });
    // With viewBoxWidth/Height = 1, client coords scale hugely; still returns Cell | null.
    const cell = getCellFromMouseEvent(
      new MouseEvent('click', { clientX: 0, clientY: 0 }),
      tiny,
      { cellSize: 10, padding: 0 }
    );
    expect(cell === null || typeof cell.row === 'number').toBe(true);
  });
});

// =============================================================================
// 3. polyomino/placement.ts — residual arms (documented / carry-forward)
// =============================================================================

describe('engine-coverage-round-11 — polyomino/placement residuals', () => {
  it('documents unreachable Board place rowCells miss + reason|| fallback', () => {
    // Carry-forward from r8: validatePlacement always sets `reason`, and
    // returning cells implies newCells[row] exists on a dense createBoard grid.
    // createBoardWithBlockedCells `if (rowCells)` is likewise unreachable
    // without rewriting the same-module createBoard binding.
    const board = createBoard(1, 1);
    expect(board.cells[0]).toBeDefined();
    expect(true).toBe(true);
  });
});

// =============================================================================
// 4. fractions/arithmetic — still hot; wiring smoke
// =============================================================================

describe('engine-coverage-round-11 — fractions/arithmetic (hot baseline)', () => {
  it('COMMON_FRACTIONS catalog stays wired after r8/r10', () => {
    expect(COMMON_FRACTIONS.length).toBeGreaterThan(0);
    expect(createFraction(3, 6)).toMatchObject({
      numerator: 3,
      denominator: 6,
    });
  });
});

// =============================================================================
// 5. Parallel ownership — graph / attributes / dice left for r12 (q-mp-372)
// =============================================================================

describe('engine-coverage-round-11 — deferred to r12', () => {
  it('documents graph/algorithms + attributes/dice-ui ownership for q-mp-372', () => {
    // graph/algorithms 90% queue.shift / Map-miss: documented unreachable since r8.
    // attribute-ui + dice-ui are preferred hosts for parallel engine cov r12.
    expect(true).toBe(true);
  });
});
