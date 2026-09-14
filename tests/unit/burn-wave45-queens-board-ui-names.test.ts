/**
 * Wave 45 TOKENMAXX — Queens board-ui names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/queens-guards/board-ui';

describe('Wave 45 queens — board-ui names', () => {
  it('distinct seat names', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
    expect(getPlayerName('player1').length).toBeGreaterThan(0);
  });
});
