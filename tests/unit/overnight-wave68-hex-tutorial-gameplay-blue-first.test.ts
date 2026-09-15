/**
 * Wave 68 leftover after tip/#336 — Hex gameplay Blue first + cannot move. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial gameplay Blue first', () => {
  it('gameplay locks Blue goes first + cannot be moved once placed', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain('Blue goes first');
    expect(step?.message).toContain('click any empty hex to place your piece');
    expect(step?.message).toContain('Pieces cannot be moved once placed');
  });
});
