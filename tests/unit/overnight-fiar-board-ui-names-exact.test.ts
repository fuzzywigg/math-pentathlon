/**
 * Overnight TOKENMAXX — FIAR board-ui exact Blue/Red leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName, getPlayerColor } from '../../src/games/fiar/board-ui';

describe('Overnight fiar — board-ui names', () => {
  it('exact Blue/Red and distinct colors', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
    expect(getPlayerColor('player1')).not.toBe(getPlayerColor('player2'));
  });
});
