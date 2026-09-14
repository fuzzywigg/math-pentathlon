/**
 * Wave 45 TOKENMAXX — Pinball board-ui names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 45 pinball — board-ui names', () => {
  it('distinct seat names', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
