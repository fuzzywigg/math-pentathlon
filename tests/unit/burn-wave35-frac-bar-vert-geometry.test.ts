/**
 * Wave 35 — vertical bar fill-from-bottom, right label growth, division lines.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { renderVerticalBar } from '../../src/core/fractions/fraction-bar-ui';

describe('Wave 35 frac-bar-vert-geometry', () => {
  it('right label widens svg and places text to the side', () => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 2 },
      { width: 40, height: 100, showLabel: true, labelPosition: 'right' }
    );
    expect(Number(svg.getAttribute('width'))).toBe(80);
    const text = svg.querySelector('text');
    expect(text?.textContent).toBe('1/2');
    expect(Number(text?.getAttribute('x'))).toBe(45);
  });

  it('below label does not widen (right-only growth)', () => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 3 },
      { width: 40, height: 80, showLabel: true, labelPosition: 'below' }
    );
    expect(Number(svg.getAttribute('width'))).toBe(40);
    expect(svg.querySelector('text')).toBeNull();
  });

  it('fill grows upward from bottom', () => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 2 },
      { width: 40, height: 100, showLabel: false }
    );
    const fill = svg.querySelectorAll('rect')[1];
    expect(Number(fill.getAttribute('height'))).toBeCloseTo(49, 0);
    expect(Number(fill.getAttribute('y'))).toBeCloseTo(50, 0);
  });

  it('zero fill skips fill rect; full fill covers height', () => {
    const zero = renderVerticalBar(
      { numerator: 0, denominator: 4 },
      { showLabel: false, height: 80 }
    );
    expect(zero.querySelectorAll('rect')).toHaveLength(1);

    const full = renderVerticalBar(
      { numerator: 5, denominator: 5 },
      { showLabel: false, height: 80 }
    );
    const fill = full.querySelectorAll('rect')[1];
    expect(Number(fill.getAttribute('height'))).toBeCloseTo(78, 0);
    expect(Number(fill.getAttribute('y'))).toBeCloseTo(1, 0);
  });

  it.each([
    [1, 0],
    [4, 3],
    [12, 11],
    [15, 0],
  ])('vertical denom %i → %i lines', (denom, lines) => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: denom },
      { showLabel: false }
    );
    expect(svg.querySelectorAll('line')).toHaveLength(lines);
  });
});

