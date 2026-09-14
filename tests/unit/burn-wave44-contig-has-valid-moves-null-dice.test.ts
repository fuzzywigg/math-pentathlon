/**
 * Wave 44 — Contig hasValidMoves null dice leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { hasValidMoves } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — hasValidMoves null dice', () => {
  it('false without currentDice', () => {
    expect(hasValidMoves(createInitialState())).toBe(false);
  });
});
