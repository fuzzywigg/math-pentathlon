/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — frac × pinball registry field handshake.
 * Complements wave56 division handshake with playerCount × difficulty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';

describe('Wave 57 handshake — registry fields', () => {
  it('both engines share 2 Players + intermediate leftovers', () => {
    const frac = getGameById('frac-fact');
    const pin = getGameById('fraction-pinball');
    expect(frac?.playerCount).toBe('2 Players');
    expect(pin?.playerCount).toBe('2 Players');
    expect(frac?.difficulty).toBe('intermediate');
    expect(pin?.difficulty).toBe('intermediate');
    expect(frac?.gradeRange).toBe(pin?.gradeRange);
  });
});
