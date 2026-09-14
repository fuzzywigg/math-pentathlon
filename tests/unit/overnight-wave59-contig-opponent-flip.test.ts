/**
 * Wave 59 Contig/SD residual — Contig getOpponent flip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent } from '../../src/games/contig-60/types';

describe('Wave 59 contig — getOpponent', () => {
  it('flips player1 ↔ player2', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
