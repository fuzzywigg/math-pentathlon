/**
 * Wave 45 TOKENMAXX — Remainder board-ui names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/remainder-islands/board-ui';

describe('Wave 45 remainder — board-ui names', () => {
  it('distinct seat names', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
