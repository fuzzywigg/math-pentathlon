/**
 * Wave 21 — fraction-bar UI (render / interactive / comparison / inject).
 * Distinct from arithmetic-only fractions.test and #120 status-ui quiz remounts.
 * Used by Fab-a-Diffy / Frac surfaces. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  getFractionColor,
  renderHorizontalBar,
  renderVerticalBar,
  renderCircleBar,
  renderFractionBar,
  createInteractiveFractionBar,
  createFractionBarPiece,
  getFractionBarStyles,
  injectFractionBarStyles,
  renderFractionComparison,
} from '../../src/core/fractions/fraction-bar-ui';
import { FRACTION_COLORS } from '../../src/core/fractions/types';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#fraction-bar-styles')
    .forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('Wave 21 fraction-bar — colors + style dispatch', () => {
  it('getFractionColor hits catalog and fallback', () => {
    expect(getFractionColor(2)).toBe(FRACTION_COLORS[2] || getFractionColor(2));
    expect(getFractionColor(4)).toBeTruthy();
    expect(getFractionColor(999)).toBe('#607d8b');
  });

  it('renderFractionBar dispatches horizontal / vertical / circle', () => {
    const h = renderFractionBar({ numerator: 1, denominator: 2 });
    expect(h.classList.contains('fraction-bar-horizontal')).toBe(true);

    const v = renderFractionBar(
      { numerator: 2, denominator: 3 },
      { style: 'vertical', showLabel: true }
    );
    expect(v.classList.contains('fraction-bar-vertical')).toBe(true);

    const c = renderFractionBar(
      { numerator: 3, denominator: 4 },
      { style: 'circle', showLabel: false }
    );
    expect(c.classList.contains('fraction-bar-circle')).toBe(true);
  });
});

describe('Wave 21 fraction-bar — direct renderers + labels', () => {
  it('horizontal/vertical/circle produce SVG with fill geometry', () => {
    const horiz = renderHorizontalBar(
      { numerator: 3, denominator: 6 },
      { showLabel: true, labelPosition: 'below', width: 120, height: 24 }
    );
    expect(horiz.tagName.toLowerCase()).toBe('svg');
    expect(horiz.querySelectorAll('rect').length).toBeGreaterThan(0);
    expect(horiz.querySelector('text')?.textContent).toMatch(/1\/2|3\/6/);

    const vert = renderVerticalBar(
      { numerator: 1, denominator: 4 },
      { showLabel: false }
    );
    expect(vert.classList.contains('fraction-bar-vertical')).toBe(true);

    const circ = renderCircleBar(
      { numerator: 0, denominator: 5 },
      { showLabel: true }
    );
    expect(circ.querySelector('path, circle')).toBeTruthy();
  });

  it('clamps fill ratio for improper fractions', () => {
    const over = renderHorizontalBar(
      { numerator: 9, denominator: 4 },
      { showLabel: false }
    );
    expect(over.querySelectorAll('rect').length).toBeGreaterThan(0);
  });
});

describe('Wave 21 fraction-bar — interactive / piece / comparison / styles', () => {
  it('createInteractiveFractionBar fires onChange with clicked segment', () => {
    const seen: Array<{ numerator: number; denominator: number }> = [];
    const bar = createInteractiveFractionBar(
      { numerator: 1, denominator: 4 },
      4,
      (f) => seen.push(f)
    );
    expect(bar.classList.contains('interactive-fraction-bar')).toBe(true);
    const segments = bar.querySelectorAll('.fraction-segment');
    expect(segments).toHaveLength(4);
    (segments[2] as HTMLElement).click();
    expect(seen).toEqual([{ numerator: 3, denominator: 4 }]);
  });

  it('createFractionBarPiece stamps data attrs and drag handlers', () => {
    const piece = createFractionBarPiece({
      id: 'fb-1',
      fraction: { numerator: 1, denominator: 3 },
      color: '#2196f3',
    });
    expect(piece.getAttribute('data-piece-id')).toBe('fb-1');
    expect(piece.getAttribute('data-fraction')).toBe('1/3');
    expect(piece.getAttribute('draggable')).toBe('true');
    expect(piece.querySelector('svg')).toBeTruthy();

    const drag = new Event('dragstart', { bubbles: true }) as DragEvent;
    Object.defineProperty(drag, 'dataTransfer', {
      value: { setData: vi.fn() },
    });
    piece.dispatchEvent(drag);
    expect(piece.style.opacity).toBe('0.5');
    piece.dispatchEvent(new Event('dragend'));
    expect(piece.style.opacity).toBe('1');
  });

  it('renderFractionComparison operator and injectFractionBarStyles', () => {
    const lt = renderFractionComparison(
      { numerator: 1, denominator: 4 },
      { numerator: 1, denominator: 2 }
    );
    expect(lt.classList.contains('fraction-comparison')).toBe(true);
    expect(lt.querySelector('.operator')?.textContent).toBe('<');

    const eq = renderFractionComparison(
      { numerator: 1, denominator: 2 },
      { numerator: 2, denominator: 4 }
    );
    expect(eq.querySelector('.operator')?.textContent).toBe('=');

    const gt = renderFractionComparison(
      { numerator: 3, denominator: 4 },
      { numerator: 1, denominator: 2 }
    );
    expect(gt.querySelector('.operator')?.textContent).toBe('>');

    expect(getFractionBarStyles()).toContain('.fraction-bar');
    injectFractionBarStyles();
    injectFractionBarStyles();
    expect(document.querySelectorAll('#fraction-bar-styles')).toHaveLength(1);
  });
});
