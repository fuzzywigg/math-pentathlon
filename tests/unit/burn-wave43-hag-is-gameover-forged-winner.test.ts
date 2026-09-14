/**
 * Wave 43 — Hex-a-Gone isGameOver forged winner leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { isGameOver } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — isGameOver forged', () => {
  it('true when winner set even if phase still selectBlocks', () => {
    const forged = {
      ...createInitialState(),
      winner: 'player2' as const,
      phase: 'selectBlocks' as const,
    };
    expect(isGameOver(forged)).toBe(true);
    expect(isGameOver(createInitialState())).toBe(false);
  });
});
