/**
 * Wave 45 TOKENMAXX — Par-55 board-ui names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/par-55/board-ui';

describe('Wave 45 par55 — board-ui names', () => {
  it('distinct seat names', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
