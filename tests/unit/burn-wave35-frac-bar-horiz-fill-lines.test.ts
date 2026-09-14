/**
 * Wave 35 — horizontal fillRatio clamp + division-line denominator bounds.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { renderHorizontalBar } from '../../src/core/fractions/fraction-bar-ui';

function lineCount(svg: SVGSVGElement): number {
  return svg.querySelectorAll('line').length;
}

function fillRects(svg: SVGSVGElement): number {
  return svg.querySelectorAll('rect').length;
}

describe('Wave 35 frac-bar-horiz-fill-lines', () => {
  it('zero numerator draws background only (no fill rect)', () => {
    const svg = renderHorizontalBar(
      { numerator: 0, denominator: 5 },
      { showLabel: false }
    );
    expect(fillRects(svg)).toBe(1);
  });

  it('unit fraction draws fill + clip-path', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 4 },
      { showLabel: false, width: 200 }
    );
    expect(fillRects(svg)).toBe(2);
    const fill = svg.querySelectorAll('rect')[1];
    expect(fill.getAttribute('clip-path')).toContain('inset');
  });

  it('full simplified fraction omits clip-path', () => {
    const svg = renderHorizontalBar(
      { numerator: 4, denominator: 4 },
      { showLabel: false }
    );
    const fill = svg.querySelectorAll('rect')[1];
    expect(fill.getAttribute('clip-path')).toBeNull();
  });

  it('improper fraction clamps to full fill without clip', () => {
    const svg = renderHorizontalBar(
      { numerator: 9, denominator: 2 },
      { showLabel: false, width: 200 }
    );
    const fill = svg.querySelectorAll('rect')[1];
    expect(fill.getAttribute('clip-path')).toBeNull();
    expect(Number(fill.getAttribute('width'))).toBeCloseTo(198, 0);
  });

  it.each([
    [1, 0],
    [2, 1],
    [3, 2],
    [6, 5],
    [12, 11],
    [13, 0],
    [20, 0],
  ])('denominator %i yields %i division lines', (denom, lines) => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: denom },
      { showLabel: false }
    );
    expect(lineCount(svg)).toBe(lines);
  });
});

