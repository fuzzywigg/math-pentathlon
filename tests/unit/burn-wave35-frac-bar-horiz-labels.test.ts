/**
 * Wave 35 — horizontal bar labelPosition inside/below/hidden + height growth.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { renderHorizontalBar } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 frac-bar-horiz-labels', () => {
  it('below label grows svg height and places text under bar', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 2 },
      { width: 100, height: 40, showLabel: true, labelPosition: 'below' }
    );
    expect(Number(svg.getAttribute('height'))).toBe(65);
    const text = svg.querySelector('text');
    expect(text?.textContent).toBe('1/2');
    expect(Number(text?.getAttribute('y'))).toBe(58);
  });

  it('inside label keeps height and uses white fill', () => {
    const svg = renderHorizontalBar(
      { numerator: 3, denominator: 4 },
      { width: 120, height: 30, showLabel: true, labelPosition: 'inside' }
    );
    expect(Number(svg.getAttribute('height'))).toBe(30);
    const text = svg.querySelector('text');
    expect(text?.getAttribute('fill')).toBe('white');
    expect(text?.textContent).toBe('3/4');
  });

  it('showLabel false omits text and keeps base height', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 3 },
      { height: 28, showLabel: false, labelPosition: 'below' }
    );
    expect(svg.querySelector('text')).toBeNull();
    expect(Number(svg.getAttribute('height'))).toBe(28);
  });

  it('labelPosition right on horizontal does not grow height (below-only growth)', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 4 },
      { height: 40, showLabel: true, labelPosition: 'right' }
    );
    expect(Number(svg.getAttribute('height'))).toBe(40);
    expect(svg.querySelector('text')).toBeNull();
  });
});

