/**
 * Wave 35 — renderVerticalBar + renderCircleBar edge matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  renderVerticalBar,
  renderCircleBar,
} from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 frac-bar-vertical — fill from bottom + labels', () => {
  it('fills from bottom for half fraction', () => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 2 },
      { showLabel: false, width: 40, height: 102, colors: { filled: '#0f0' } }
    );
    expect(svg.classList.contains('fraction-bar-vertical')).toBe(true);
    const fill = [...svg.querySelectorAll('rect')][1];
    expect(fill.getAttribute('fill')).toBe('#0f0');
    expect(Number(fill.getAttribute('height'))).toBeCloseTo(50, 5);
    expect(Number(fill.getAttribute('y'))).toBeCloseTo(51, 5);
  });

  it('right label expands width', () => {
    const svg = renderVerticalBar(
      { numerator: 3, denominator: 4 },
      { showLabel: true, labelPosition: 'right', width: 30, height: 80 }
    );
    expect(Number(svg.getAttribute('width'))).toBe(70);
    expect(svg.querySelector('text')?.textContent).toBe('3/4');
  });

  it('below label on vertical does not expand width', () => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 5 },
      { showLabel: true, labelPosition: 'below', width: 28, height: 60 }
    );
    expect(svg.getAttribute('width')).toBe('28');
    expect(svg.querySelector('text')).toBeNull();
  });

  it('zero fill skips fill rect; simplify drops division lines', () => {
    const svg = renderVerticalBar(
      { numerator: 0, denominator: 5 },
      { showLabel: false, height: 100 }
    );
    expect(svg.querySelectorAll('rect')).toHaveLength(1);
    // simplify(0/5) → 0/1
    expect(svg.querySelectorAll('line')).toHaveLength(0);
  });

  it('denominator 1 skips division lines', () => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 1 },
      { showLabel: false }
    );
    expect(svg.querySelectorAll('line')).toHaveLength(0);
    expect(svg.querySelectorAll('rect').length).toBeGreaterThanOrEqual(2);
  });
});

describe('Wave 35 frac-bar-circle — pie / full / empty', () => {
  it('empty circle is background only', () => {
    const svg = renderCircleBar(
      { numerator: 0, denominator: 4 },
      { showLabel: false, width: 80, height: 80 }
    );
    expect(svg.classList.contains('fraction-bar-circle')).toBe(true);
    expect(svg.querySelectorAll('circle')).toHaveLength(1);
    expect(svg.querySelector('path')).toBeNull();
  });

  it('partial slice uses path with large-arc flag for > half', () => {
    const under = renderCircleBar(
      { numerator: 1, denominator: 4 },
      { showLabel: false, width: 60, height: 60 }
    );
    expect(under.querySelector('path')?.getAttribute('d')).toContain(' A ');
    expect(under.querySelector('path')?.getAttribute('d')).toMatch(/ 0 0 1 /);

    const over = renderCircleBar(
      { numerator: 3, denominator: 4 },
      { showLabel: false, width: 60, height: 60 }
    );
    expect(over.querySelector('path')?.getAttribute('d')).toMatch(/ 0 1 1 /);
  });

  it('full circle uses filled circle not path', () => {
    const svg = renderCircleBar(
      { numerator: 5, denominator: 5 },
      { showLabel: false, width: 50, height: 50, colors: { filled: '#f00' } }
    );
    const circles = [...svg.querySelectorAll('circle')];
    expect(circles.length).toBeGreaterThanOrEqual(2);
    expect(circles[1].getAttribute('fill')).toBe('#f00');
    expect(svg.querySelector('path')).toBeNull();
  });

  it('below label expands height; uses min(width,height) for size', () => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: 2 },
      { showLabel: true, labelPosition: 'below', width: 100, height: 40 }
    );
    expect(svg.getAttribute('width')).toBe('40');
    expect(svg.getAttribute('height')).toBe('65');
    expect(svg.querySelector('text')?.textContent).toBe('1/2');
  });

  it.each([2, 3, 4, 6, 8, 12])(
    'denominator %i draws den radial division lines',
    (den) => {
      const svg = renderCircleBar(
        { numerator: 1, denominator: den },
        { showLabel: false, width: 70, height: 70 }
      );
      expect(svg.querySelectorAll('line')).toHaveLength(den);
    }
  );

  it('denominator 16 skips radial lines', () => {
    const svg = renderCircleBar(
      { numerator: 1, denominator: 16 },
      { showLabel: false, width: 70, height: 70 }
    );
    expect(svg.querySelectorAll('line')).toHaveLength(0);
  });
});
