/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — frac-fact × pinball registry handshake.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getGameById,
  getGamesByDivision,
} from '../../src/core/game-registry';

describe('Wave 56 handshake — registry', () => {
  it('both engines available under Division IV leftover', () => {
    const frac = getGameById('frac-fact');
    const pin = getGameById('fraction-pinball');
    expect(frac?.available).toBe(true);
    expect(pin?.available).toBe(true);
    expect(frac?.division).toBe('Division IV');
    expect(pin?.division).toBe('Division IV');
    const ids = getGamesByDivision('Division IV').map((g) => g.id);
    expect(ids).toContain('frac-fact');
    expect(ids).toContain('fraction-pinball');
  });
});
