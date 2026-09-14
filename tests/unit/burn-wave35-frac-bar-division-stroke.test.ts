/**
 * Wave 35 — horizontal/vertical division stroke opacity + border color.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  renderHorizontalBar,
  renderVerticalBar,
} from '../../src/core/fractions/fraction-bar-ui';

describe('Wave 35 frac-bar-division-stroke', () => {
  it('horizontal lines use border color at half opacity', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 4 },
      {
        showLabel: false,
        width: 200,
        colors: { empty: '#fff', border: '#abcdef', filled: '#000' },
      }
    );
    const lines = Array.from(svg.querySelectorAll('line'));
    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line.getAttribute('stroke')).toBe('#abcdef');
      expect(line.getAttribute('stroke-opacity')).toBe('0.5');
      expect(line.getAttribute('stroke-width')).toBe('1');
    }
  });

  it('vertical lines spaced by segment height', () => {
    const svg = renderVerticalBar(
      { numerator: 1, denominator: 4 },
      {
        showLabel: false,
        height: 102,
        width: 40,
        colors: { empty: '#fff', border: '#010203', filled: '#000' },
      }
    );
    const lines = Array.from(svg.querySelectorAll('line'));
    expect(lines).toHaveLength(3);
    const ys = lines.map((l) => Number(l.getAttribute('y1')));
    expect(ys[0]).toBeCloseTo(1 + 25, 5);
    expect(ys[1]).toBeCloseTo(1 + 50, 5);
    expect(ys[2]).toBeCloseTo(1 + 75, 5);
    expect(lines[0].getAttribute('stroke')).toBe('#010203');
  });

  it('horizontal segment x positions scale with width', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 5 },
      { showLabel: false, width: 102 }
    );
    const xs = Array.from(svg.querySelectorAll('line')).map((l) =>
      Number(l.getAttribute('x1'))
    );
    expect(xs).toHaveLength(4);
    expect(xs[0]).toBeCloseTo(1 + 20, 5);
    expect(xs[3]).toBeCloseTo(1 + 80, 5);
  });
});
