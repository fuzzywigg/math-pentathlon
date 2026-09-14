/**
 * Wave 35 — renderHorizontalBar geometry / labels / division lines matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { renderHorizontalBar } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 frac-bar-horizontal — fill / empty / full', () => {
  it('zero numerator draws background only (simplify → 0/1, no lines)', () => {
    const svg = renderHorizontalBar(
      { numerator: 0, denominator: 4 },
      { showLabel: false, width: 100, height: 20 }
    );
    expect(svg.classList.contains('fraction-bar-horizontal')).toBe(true);
    expect(svg.querySelectorAll('rect')).toHaveLength(1);
    // simplify(0/4) → 0/1, so division-line branch is skipped
    expect(svg.querySelectorAll('line')).toHaveLength(0);
  });

  it('unit fraction fills and clips right side', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 4 },
      { showLabel: false, width: 102, height: 22, colors: { filled: '#abc' } }
    );
    const rects = [...svg.querySelectorAll('rect')];
    expect(rects).toHaveLength(2);
    const fill = rects[1];
    expect(fill.getAttribute('fill')).toBe('#abc');
    expect(fill.getAttribute('clip-path')).toContain('inset');
    expect(Number(fill.getAttribute('width'))).toBeCloseTo(25, 5);
  });

  it('full simplified fraction has no clip-path', () => {
    const svg = renderHorizontalBar(
      { numerator: 4, denominator: 4 },
      { showLabel: false, width: 102, height: 22 }
    );
    const fill = [...svg.querySelectorAll('rect')][1];
    expect(fill.getAttribute('clip-path')).toBeNull();
    expect(Number(fill.getAttribute('width'))).toBeCloseTo(100, 5);
  });

  it('improper fraction clamps fill to full width', () => {
    const svg = renderHorizontalBar(
      { numerator: 9, denominator: 2 },
      { showLabel: false, width: 102, height: 20 }
    );
    const fill = [...svg.querySelectorAll('rect')][1];
    expect(Number(fill.getAttribute('width'))).toBeCloseTo(100, 5);
    expect(fill.getAttribute('clip-path')).toBeNull();
  });
});

describe('Wave 35 frac-bar-horizontal — labels + division lines', () => {
  it('below label expands height and shows simplified text', () => {
    const svg = renderHorizontalBar(
      { numerator: 2, denominator: 4 },
      { showLabel: true, labelPosition: 'below', width: 80, height: 30 }
    );
    expect(svg.getAttribute('height')).toBe('55');
    expect(svg.querySelector('text')?.textContent).toBe('1/2');
  });

  it('inside label keeps height and centers white text', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 3 },
      { showLabel: true, labelPosition: 'inside', width: 90, height: 40 }
    );
    expect(svg.getAttribute('height')).toBe('40');
    const text = svg.querySelector('text');
    expect(text?.textContent).toBe('1/3');
    expect(text?.getAttribute('fill')).toBe('white');
  });

  it('denominator > 12 skips division lines', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 16 },
      { showLabel: false }
    );
    expect(svg.querySelectorAll('line')).toHaveLength(0);
  });

  it.each([2, 3, 5, 6, 8, 10, 12])(
    'denominator %i draws den-1 division lines',
    (den) => {
      const svg = renderHorizontalBar(
        { numerator: 1, denominator: den },
        { showLabel: false, width: 120, height: 24 }
      );
      expect(svg.querySelectorAll('line')).toHaveLength(den - 1);
    }
  );

  it('custom empty/border colors land on background rect', () => {
    const svg = renderHorizontalBar(
      { numerator: 0, denominator: 3 },
      {
        showLabel: false,
        colors: { empty: '#eee', border: '#111' },
      }
    );
    const bg = svg.querySelector('rect')!;
    expect(bg.getAttribute('fill')).toBe('#eee');
    expect(bg.getAttribute('stroke')).toBe('#111');
  });
});
