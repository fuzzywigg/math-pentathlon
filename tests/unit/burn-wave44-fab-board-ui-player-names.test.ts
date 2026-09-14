/**
 * Wave 44 overnight HEAVY — Fab board-ui getPlayerName.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 44 fab board-ui — names', () => {
  it('Blue / Red seats', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
