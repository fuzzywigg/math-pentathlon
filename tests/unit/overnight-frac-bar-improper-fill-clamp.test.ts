/**
 * Overnight TOKENMAXX HEAVY — horizontal fillRatio clamp improper leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  renderHorizontalBar,
  renderCircleBar,
} from '../../src/core/fractions/fraction-bar-ui';
import { createFraction } from '../../src/core/fractions/arithmetic';

describe('Overnight frac-bar — improper fill clamp', () => {
  it('improper fraction clamps fill; zero has no fill rect/path', () => {
    const improper = renderHorizontalBar(createFraction(5, 2), {
      showLabel: false,
      width: 100,
      height: 20,
    });
    const fills = improper.querySelectorAll('rect');
    // bg + fill
    expect(fills.length).toBeGreaterThanOrEqual(2);
    const fill = fills[1];
    expect(Number(fill.getAttribute('width'))).toBeCloseTo(98, 0);

    const zero = renderHorizontalBar(createFraction(0, 3), {
      showLabel: false,
    });
    expect(zero.querySelectorAll('rect').length).toBe(1);

    const fullCircle = renderCircleBar(createFraction(4, 2), {
      showLabel: false,
      width: 60,
      height: 60,
    });
    // full fill uses circle not path
    expect(fullCircle.querySelectorAll('circle').length).toBe(2);
    expect(fullCircle.querySelector('path')).toBeNull();
  });
});
