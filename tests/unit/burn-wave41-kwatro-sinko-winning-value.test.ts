/**
 * Wave 41 — Kwatro-Sinko isWinningValue leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { isWinningValue, CONFIG } from '../../src/games/kwatro-sinko/types';

describe('Wave 41 kwatro — isWinningValue from types', () => {
  it('accepts only CONFIG.TARGET_VALUES (4 and 5)', () => {
    for (const v of CONFIG.TARGET_VALUES) {
      expect(isWinningValue(v)).toBe(true);
    }
    expect(isWinningValue(4)).toBe(true);
    expect(isWinningValue(5)).toBe(true);
  });

  it('rejects nearby integers and non-targets', () => {
    for (const v of [-1, 0, 1, 2, 3, 6, 7, 9, 10, 45]) {
      expect(isWinningValue(v)).toBe(false);
    }
  });
});
