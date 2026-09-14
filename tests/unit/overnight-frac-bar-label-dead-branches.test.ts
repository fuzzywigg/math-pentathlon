/**
 * Overnight TOKENMAXX HEAVY — fraction-bar labelPosition dead branches leftover.
 * Horizontal 'right' and circle 'inside'|'right' omit labels.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  renderHorizontalBar,
  renderCircleBar,
  renderVerticalBar,
} from '../../src/core/fractions/fraction-bar-ui';
import { createFraction } from '../../src/core/fractions/arithmetic';

describe('Overnight frac-bar — labelPosition dead branches', () => {
  it('horizontal + labelPosition right omits text despite showLabel', () => {
    const svg = renderHorizontalBar(createFraction(1, 2), {
      showLabel: true,
      labelPosition: 'right',
    });
    expect(svg.querySelector('text')).toBeNull();
  });

  it('circle + inside/right omit text; below draws', () => {
    const inside = renderCircleBar(createFraction(1, 3), {
      showLabel: true,
      labelPosition: 'inside',
      width: 80,
      height: 80,
    });
    const right = renderCircleBar(createFraction(1, 3), {
      showLabel: true,
      labelPosition: 'right',
      width: 80,
      height: 80,
    });
    const below = renderCircleBar(createFraction(1, 3), {
      showLabel: true,
      labelPosition: 'below',
      width: 80,
      height: 80,
    });
    expect(inside.querySelector('text')).toBeNull();
    expect(right.querySelector('text')).toBeNull();
    expect(below.querySelector('text')?.textContent).toBe('1/3');
  });

  it('vertical below omits text; right draws', () => {
    const below = renderVerticalBar(createFraction(2, 5), {
      showLabel: true,
      labelPosition: 'below',
      width: 40,
      height: 120,
    });
    const right = renderVerticalBar(createFraction(2, 5), {
      showLabel: true,
      labelPosition: 'right',
      width: 40,
      height: 120,
    });
    expect(below.querySelector('text')).toBeNull();
    expect(right.querySelector('text')?.textContent).toBe('2/5');
  });
});
