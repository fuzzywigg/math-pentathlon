/**
 * Wave 59 Contig/SD residual — Sum getPlayerName Blue/Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 sum — getPlayerName', () => {
  it('maps seats to Blue and Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
