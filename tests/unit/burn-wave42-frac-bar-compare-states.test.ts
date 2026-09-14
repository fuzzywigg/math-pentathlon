/**
 * Wave 42 — renderFractionComparison relation states leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  createFraction,
  renderFractionComparison,
} from '../../src/core/fractions';

beforeEach(() => {
  document.body.innerHTML = '';
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 42 frac-bar — compare states', () => {
  it('equal simplified values → =', () => {
    const el = renderFractionComparison(
      createFraction(1, 2),
      createFraction(2, 4)
    );
    expect(el.querySelector('.operator')?.textContent).toBe('=');
  });

  it('less-than → <', () => {
    const el = renderFractionComparison(
      createFraction(1, 4),
      createFraction(1, 2)
    );
    expect(el.querySelector('.operator')?.textContent).toBe('<');
  });

  it('greater-than → >', () => {
    const el = renderFractionComparison(
      createFraction(3, 4),
      createFraction(1, 3)
    );
    expect(el.querySelector('.operator')?.textContent).toBe('>');
  });

  it('wrapper has fraction-comparison class and two bars', () => {
    const el = renderFractionComparison(
      createFraction(1, 3),
      createFraction(2, 3)
    );
    expect(el.classList.contains('fraction-comparison')).toBe(true);
    expect(el.querySelectorAll('svg').length).toBe(2);
  });

  it('zero vs positive is less-than', () => {
    const el = renderFractionComparison(
      createFraction(0, 5),
      createFraction(1, 5)
    );
    expect(el.querySelector('.operator')?.textContent).toBe('<');
  });
});
