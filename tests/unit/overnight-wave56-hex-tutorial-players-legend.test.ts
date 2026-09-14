/**
 * Wave 56 leftover after #256 — Hex tutorial players legend step. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 56 hex — tutorial players', () => {
  it('players step highlights legend with Blue/Red directions', () => {
    const players = hexTutorial.steps.find((s) => s.id === 'players');
    expect(players?.highlightSelector).toBe('.hex-legend');
    expect(players?.message).toMatch(/top to bottom/);
    expect(players?.message).toMatch(/left to right/);
    expect(players?.title).toBe('Players');
  });
});
