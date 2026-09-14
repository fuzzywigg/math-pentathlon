/**
 * Wave 43 TOKENMAXX — Sum Dominoes board-ui names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 43 sum-dominoes — board-ui names', () => {
  it('distinct seat names', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
    expect(getPlayerName('player1').length).toBeGreaterThan(0);
  });
});
