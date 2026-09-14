/**
 * Wave 43 — getCategoryFromDie fallback leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getCategoryFromDie } from '../../src/games/juggle/types';

describe('Wave 43 juggle — category fallback', () => {
  it('unknown die values fall back to monomino', () => {
    expect(getCategoryFromDie(0)).toBe('monomino');
    expect(getCategoryFromDie(99)).toBe('monomino');
  });
});
