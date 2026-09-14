/**
 * Wave 35 — circle pie largeArc / full / empty / division rays.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { renderCircleBar } from '../../src/core/fractions/fraction-bar-ui';

describe('Wave 35 frac-bar-circle-arcs', () => {
  it('empty fraction is background circle only', () => {
    const svg = renderCircleBar(
      { numerator: 0, denominator: 4 },
      { width: 100, height: 100, showLabel: false }
    );
    expect(svg.querySelectorAll('circle')).toHaveLength(1);
    expect(svg.querySelector('path')).toBeNull();
  });

  it('quarter uses small arc (largeArc=0)', () => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: 4 },
      { width: 100, height: 100, showLabel: false }
    );
    const d = svg.querySelector('path')?.getAttribute('d') ?? '';
    expect(d).toContain(' A ');
    expect(d).toMatch(/0 0 1 /);
  });

  it('three-quarters uses large arc (largeArc=1)', () => {
    const svg = renderCircleBar(
      { numerator: 3, denominator: 4 },
      { width: 100, height: 100, showLabel: false }
    );
    const d = svg.querySelector('path')?.getAttribute('d') ?? '';
    expect(d).toMatch(/0 1 1 /);
  });

  it('full circle uses filled circle not path', () => {
    const svg = renderCircleBar(
      { numerator: 2, denominator: 2 },
      { width: 80, height: 80, showLabel: false }
    );
    expect(svg.querySelector('path')).toBeNull();
    expect(svg.querySelectorAll('circle')).toHaveLength(2);
  });

  it('improper clamps to full filled circle', () => {
    const svg = renderCircleBar(
      { numerator: 9, denominator: 3 },
      { width: 60, height: 90, showLabel: false }
    );
    expect(Number(svg.getAttribute('width'))).toBe(60);
    expect(svg.querySelectorAll('circle')).toHaveLength(2);
  });

  it('below label grows height; inside does not add circle label', () => {
    const below = renderCircleBar(
      { numerator: 1, denominator: 2 },
      { width: 50, height: 50, showLabel: true, labelPosition: 'below' }
    );
    expect(Number(below.getAttribute('height'))).toBe(75);
    expect(below.querySelector('text')?.textContent).toBe('1/2');

    const inside = renderCircleBar(
      { numerator: 1, denominator: 2 },
      { width: 50, height: 50, showLabel: true, labelPosition: 'inside' }
    );
    expect(Number(inside.getAttribute('height'))).toBe(50);
    expect(inside.querySelector('text')).toBeNull();
  });

  it.each([
    [1, 0],
    [2, 2],
    [8, 8],
    [12, 12],
    [13, 0],
  ])('circle denom %i → %i rays', (denom, rays) => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: denom },
      { showLabel: false, width: 100, height: 100 }
    );
    expect(svg.querySelectorAll('line')).toHaveLength(rays);
  });
});

