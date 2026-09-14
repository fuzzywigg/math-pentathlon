/**
 * Wave 59 Contig/SD residual — Sum getOpponent flip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent } from '../../src/games/sum-dominoes/types';

describe('Wave 59 sum — getOpponent', () => {
  it('flips player1 ↔ player2', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
