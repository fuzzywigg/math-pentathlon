/**
 * Wave 68 leftover after tip/#334 — Hex gameplay empty-hex place exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial gameplay empty hex', () => {
  it('gameplay locks click any empty hex + immovable exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain(
      'On your turn, click any empty hex to place your piece'
    );
    expect(step?.message).toContain('Pieces cannot be moved once placed');
    expect(step?.highlightSelector).toBe('.hex-board');
  });
});
