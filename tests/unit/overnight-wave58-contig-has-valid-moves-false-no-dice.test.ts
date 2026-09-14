/**
 * Wave 58 Contig/SD residual — Contig hasValidMoves false without dice. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { hasValidMoves } from '../../src/games/contig-60/rules';

describe('Wave 58 contig — hasValidMoves no dice', () => {
  it('returns false when currentDice is null', () => {
    expect(hasValidMoves(createInitialState())).toBe(false);
  });
});
