/**
 * Wave 35 — renderFractionBar dispatch + comparison + styles leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  renderFractionBar,
  renderFractionComparison,
  getFractionBarStyles,
  injectFractionBarStyles,
} from '../../src/core/fractions/fraction-bar-ui';
import { COMMON_FRACTIONS } from '../../src/core/fractions/types';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#fraction-bar-styles')
    .forEach((el) => el.remove());
});

describe('Wave 35 frac-bar-dispatch — style switch', () => {
  it.each([
    [undefined, 'fraction-bar-horizontal'],
    ['horizontal', 'fraction-bar-horizontal'],
    ['vertical', 'fraction-bar-vertical'],
    ['circle', 'fraction-bar-circle'],
  ] as const)('style %s → class %s', (style, cls) => {
    const svg = renderFractionBar(
      { numerator: 1, denominator: 2 },
      style ? { style } : {}
    );
    expect(svg.classList.contains(cls)).toBe(true);
  });

  it('unknown style falls through to horizontal default branch', () => {
    const svg = renderFractionBar(
      { numerator: 2, denominator: 3 },
      // force default arm via cast
      { style: 'diagonal' as 'horizontal' }
    );
    expect(svg.classList.contains('fraction-bar-horizontal')).toBe(true);
  });

  it('COMMON_FRACTIONS each render without throw for all styles', () => {
    for (const f of COMMON_FRACTIONS) {
      for (const style of ['horizontal', 'vertical', 'circle'] as const) {
        const svg = renderFractionBar(f, { style, showLabel: false });
        expect(svg.tagName.toLowerCase()).toBe('svg');
      }
    }
  });
});

describe('Wave 35 frac-bar-compare — operators + config passthrough', () => {
  it.each([
    [{ n: 1, d: 5 }, { n: 1, d: 2 }, '<'],
    [{ n: 1, d: 2 }, { n: 2, d: 4 }, '='],
    [{ n: 7, d: 8 }, { n: 1, d: 2 }, '>'],
    [{ n: 0, d: 3 }, { n: 0, d: 9 }, '='],
    [{ n: 5, d: 4 }, { n: 9, d: 8 }, '>'],
  ] as const)('compares %j vs %j → %s', (a, b, op) => {
    const el = renderFractionComparison(
      { numerator: a.n, denominator: a.d },
      { numerator: b.n, denominator: b.d },
      { style: 'circle', showLabel: false, width: 40, height: 40 }
    );
    expect(el.querySelector('.operator')?.textContent).toBe(op);
    expect(el.querySelectorAll('svg')).toHaveLength(2);
    expect(el.querySelectorAll('.fraction-bar-circle')).toHaveLength(2);
  });

  it('comparison preserves vertical style on both bars', () => {
    const el = renderFractionComparison(
      { numerator: 1, denominator: 3 },
      { numerator: 2, denominator: 3 },
      { style: 'vertical', showLabel: false }
    );
    expect(el.querySelectorAll('.fraction-bar-vertical')).toHaveLength(2);
  });
});

describe('Wave 35 frac-bar-styles — CSS string + inject idempotent', () => {
  it('getFractionBarStyles covers key selectors', () => {
    const css = getFractionBarStyles();
    for (const needle of [
      '.fraction-bar',
      '.fraction-bar-piece',
      '.interactive-fraction-bar',
      '.fraction-comparison',
      '.operator',
    ]) {
      expect(css).toContain(needle);
    }
  });

  it('injectFractionBarStyles is idempotent across calls', () => {
    injectFractionBarStyles();
    injectFractionBarStyles();
    injectFractionBarStyles();
    expect(document.querySelectorAll('#fraction-bar-styles')).toHaveLength(1);
    expect(document.getElementById('fraction-bar-styles')?.textContent).toContain(
      '.fraction-bar'
    );
  });
});
