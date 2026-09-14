/**
 * Wave 40 — frac-ui compare matrix + style dispatch leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createFraction,
  renderFractionComparison,
  renderFractionBar,
  renderVerticalBar,
} from '../../src/core/fractions';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 40 frac-ui — compare matrix + style dispatch', () => {
  it('compare matrix: < = > for ordered pairs', () => {
    const cases: Array<[number, number, number, number, string]> = [
      [1, 4, 1, 2, '<'],
      [1, 2, 2, 4, '='],
      [3, 4, 1, 2, '>'],
      [0, 5, 0, 3, '='],
      [5, 5, 1, 5, '>'],
    ];
    for (const [an, ad, bn, bd, symbol] of cases) {
      const el = renderFractionComparison(
        createFraction(an, ad),
        createFraction(bn, bd),
        { showLabel: false }
      );
      expect(el.className).toBe('fraction-comparison');
      expect(el.querySelector('.operator')?.textContent).toBe(symbol);
      expect(el.querySelectorAll('svg')).toHaveLength(2);
    }
  });

  it('style dispatch: horizontal / vertical / circle class names', () => {
    const f = createFraction(2, 5);
    expect(
      renderFractionBar(f, { style: 'horizontal', showLabel: false }).classList
        .contains('fraction-bar-horizontal')
    ).toBe(true);
    expect(
      renderFractionBar(f, { style: 'vertical', showLabel: false }).classList
        .contains('fraction-bar-vertical')
    ).toBe(true);
    expect(
      renderFractionBar(f, { style: 'circle', showLabel: false }).classList
        .contains('fraction-bar-circle')
    ).toBe(true);
  });

  it('vertical bar with labelPosition right extends width', () => {
    const noLabel = renderVerticalBar(createFraction(1, 3), {
      showLabel: false,
      width: 40,
      height: 100,
    });
    const withLabel = renderVerticalBar(createFraction(1, 3), {
      showLabel: true,
      labelPosition: 'right',
      width: 40,
      height: 100,
    });
    expect(Number(withLabel.getAttribute('width'))).toBeGreaterThan(
      Number(noLabel.getAttribute('width'))
    );
    expect(withLabel.querySelector('text')?.textContent).toMatch(/1/);
  });

  it('unknown style falls through to horizontal default branch', () => {
    const svg = renderFractionBar(createFraction(1, 2), {
      // @ts-expect-error intentional unknown style
      style: 'spiral',
      showLabel: false,
    });
    expect(svg.classList.contains('fraction-bar-horizontal')).toBe(true);
  });

  it('compare with circle style still embeds two svgs', () => {
    const el = renderFractionComparison(
      createFraction(1, 8),
      createFraction(1, 4),
      { style: 'circle', showLabel: false, width: 40, height: 40 }
    );
    expect(el.querySelector('.operator')?.textContent).toBe('<');
    expect(
      [...el.querySelectorAll('svg')].every((s) =>
        s.classList.contains('fraction-bar-circle')
      )
    ).toBe(true);
  });
});
