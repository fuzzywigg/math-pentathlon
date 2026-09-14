/**
 * Wave 59 Contig/SD residual — Contig × Sum getPlayerName handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as contigName } from '../../src/games/contig-60/board-ui';
import { getPlayerName as sumName } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 handshake — player names', () => {
  it('both games share Blue/Red seat names', () => {
    expect(contigName('player1')).toBe(sumName('player1'));
    expect(contigName('player2')).toBe(sumName('player2'));
    expect(contigName('player1')).toBe('Blue');
    expect(contigName('player2')).toBe('Red');
  });
});
