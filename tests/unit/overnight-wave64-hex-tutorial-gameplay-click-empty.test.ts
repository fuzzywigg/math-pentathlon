/**
 * Wave 64 leftover after tip/#303 — Hex gameplay click empty hex exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 64 hex — tutorial gameplay click empty', () => {
  it('On your turn click any empty hex; pieces immovable once placed', () => {
    const gameplay = hexTutorial.steps.find((s) => s.id === 'gameplay');
    expect(gameplay?.message).toMatch(/On your turn, click any empty hex to place your piece/);
    expect(gameplay?.message).toMatch(/Pieces cannot be moved once placed/);
    expect(gameplay?.position).toBe('bottom');
  });
});
