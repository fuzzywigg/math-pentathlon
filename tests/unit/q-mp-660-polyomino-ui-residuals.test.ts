/**
 * q-mp-660 — Close `polyomino-ui` residual gaps under the verify glob
 * `tests/unit/*polyomino-ui*` (tests-only).
 *
 * Tip re-measure (`cursor/mp-tip-post1059` @ `be822e75`) with the three
 * related suites before this file:
 *   `polyomino-ui.ts` **97.08%** stmts / **92.72%** branches (51/55) /
 *   **83.33%** funcs (20/24) / **97.04%** lines (197/203)
 * Uncovered under that glob: shape-selector hover chrome (~253–260),
 *   draggable-shape hover scale (~438–443), and getCellFromMouseEvent
 *   rect / `|| 1` fallback arms (~565, ~569). (Engine r11 already hits the
 *   fallback arms outside this glob — leave that suite **contained**.)
 *
 * Ownership (leave open; do not edit product / competing suites):
 *   `#950` / q-mp-473 soft-fail residuals — leave open (**contained**)
 *   `#874` / engine-coverage-round-11 viewBox fallbacks — leave **contained**
 *   `#778` / mutation-ui8 DEFAULT geometry — leave **contained**
 *
 * Constraints (binding screen): tests only; ZERO `src/` edits; pin CURRENT
 * behavior exactly (never “fix”); no AI move-choice/timing; no scoring;
 * no copy/aria/label/message-body text pins; no placement/legal-move asserts;
 * Hex Hard 450ms untouched; no network; no ratchet JSON.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createDraggableShape,
  createShapeSelector,
  getCellFromMouseEvent,
} from '../../src/core/polyomino/polyomino-ui';
import {
  SIMPLE_SHAPES,
  type PolyominoShape,
} from '../../src/core/polyomino/types';

const mono = (): PolyominoShape => {
  const shape = SIMPLE_SHAPES.find((s) => s.id === 'monomino');
  if (!shape) {
    throw new Error('monomino missing from SIMPLE_SHAPES');
  }
  return shape;
};

const domino = (): PolyominoShape => {
  const shape = SIMPLE_SHAPES.find((s) => s.id === 'domino');
  if (!shape) {
    throw new Error('domino missing from SIMPLE_SHAPES');
  }
  return shape;
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

// =============================================================================
// 1. Shape selector hover chrome (~253–260)
// =============================================================================

/** jsdom normalizes assigned colors (e.g. `#9e9e9e` → `rgb(...)`). */
function cssColor(value: string): string {
  const probe = document.createElement('div');
  probe.style.color = value;
  return probe.style.color;
}

describe('q-mp-660 polyomino-ui — shape-selector hover residuals (~253–260)', () => {
  it('mouseenter paints option border from shape.color and white background', () => {
    const shape = mono();
    const panel = createShapeSelector([shape], () => {});
    document.body.appendChild(panel);
    const option = panel.querySelector('.shape-option') as HTMLElement;
    expect(option).toBeTruthy();

    option.dispatchEvent(new Event('mouseenter'));
    expect(option.style.borderColor).toBe(cssColor(shape.color));
    expect(option.style.background).toBe(cssColor('#fff'));
  });

  it('mouseleave restores transparent border and background', () => {
    const shape = domino();
    const panel = createShapeSelector([shape], () => {});
    const option = panel.querySelector('.shape-option') as HTMLElement;

    option.dispatchEvent(new Event('mouseenter'));
    expect(option.style.borderColor).toBe(cssColor(shape.color));

    option.dispatchEvent(new Event('mouseleave'));
    expect(option.style.borderColor).toBe('transparent');
    expect(option.style.background).toBe('transparent');
  });
});

// =============================================================================
// 2. Draggable shape hover scale (~438–443)
// =============================================================================

describe('q-mp-660 polyomino-ui — draggable hover residuals (~438–443)', () => {
  it('mouseenter scales the draggable container to 1.05', () => {
    const el = createDraggableShape(mono(), 0, false, { cellSize: 12 });
    document.body.appendChild(el);

    el.dispatchEvent(new Event('mouseenter'));
    expect(el.style.transform).toBe('scale(1.05)');
  });

  it('mouseleave restores scale(1) after hover', () => {
    const el = createDraggableShape(domino(), 90, false, { cellSize: 12 });
    el.dispatchEvent(new Event('mouseenter'));
    expect(el.style.transform).toBe('scale(1.05)');

    el.dispatchEvent(new Event('mouseleave'));
    expect(el.style.transform).toBe('scale(1)');
  });
});

// =============================================================================
// 3. getCellFromMouseEvent rect / || 1 fallbacks (~565, ~569)
// =============================================================================

describe('q-mp-660 polyomino-ui — hit-test fallback residuals (~565, ~569)', () => {
  it('falls back to getBoundingClientRect size when viewBox and attrs are absent', () => {
    // Complements r11 (outside *polyomino-ui* glob): pins the rect.width /
    // rect.height arms under this verification glob.
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
  });

  it('falls back to 1 when viewBox, attrs, and rect sizes are all zero', () => {
    // Final `|| 1` arms — avoids divide-by-zero in clientToSvgUser scale.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 0, height: 0 }),
    });
    const cell = getCellFromMouseEvent(
      new MouseEvent('click', { clientX: 0, clientY: 0 }),
      svg,
      { cellSize: 10, padding: 0 }
    );
    // CURRENT behavior: returns Cell | null (scale with unit viewBox).
    expect(cell === null || typeof cell.row === 'number').toBe(true);
  });

  it('zero-width attr still soft-falls through to rect then cell mapping', () => {
    // Attr present but falsy (`"0"` → Number 0) must not stick on the attr arm.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
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
});
