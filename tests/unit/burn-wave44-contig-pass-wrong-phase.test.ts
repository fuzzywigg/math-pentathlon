/**
 * Wave 44 — Contig passTurn wrong-phase leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { passTurn } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — pass wrong phase', () => {
  it('identity outside calculating', () => {
    const s = createInitialState();
    expect(passTurn(s)).toEqual(s);
    expect(passTurn({ ...s, phase: 'gameOver', winner: 'player1' })).toEqual({
      ...s,
      phase: 'gameOver',
      winner: 'player1',
    });
  });
});
