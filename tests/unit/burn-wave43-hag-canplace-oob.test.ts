/**
 * Wave 43 — canPlaceAt OOB leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { canPlaceAt } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hag — canPlaceAt', () => {
  it('missing coords false; valid empty true', () => {
    const s = createInitialState();
    expect(canPlaceAt(s, 999, 999)).toBe(false);
    expect(canPlaceAt(s, 0, 0)).toBe(true);
  });
});
