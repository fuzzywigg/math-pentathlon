/**
 * Wave 38 — renderFractionComparison equal / style leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  createFraction,
  renderFractionComparison,
  renderFractionBar,
} from '../../src/core/fractions';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 38 frac-bar — compare equal', () => {
  it('equal fractions render comparison with =', () => {
    const a = createFraction(1, 2);
    const b = createFraction(2, 4);
    const el = renderFractionComparison(a, b);
    expect(el.textContent || el.innerHTML).toMatch(/=/);
  });

  it('unequal fractions do not claim equality symbol alone as sole relation', () => {
    const el = renderFractionComparison(
      createFraction(1, 3),
      createFraction(1, 2)
    );
    const text = el.textContent || '';
    // should include a comparison operator; accept < or >
    expect(text.includes('<') || text.includes('>') || text.includes('≠')).toBe(
      true
    );
  });

  it('renderFractionBar returns an element for common styles', () => {
    const f = createFraction(3, 4);
    for (const style of ['horizontal', 'vertical', 'circle'] as const) {
      const el = renderFractionBar(f, { style });
      expect(el).toBeTruthy();
      expect(el.childNodes.length + (el.textContent?.length || 0)).toBeGreaterThan(
        0
      );
    }
  });
});
