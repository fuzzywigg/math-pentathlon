/**
 * Wave 45 TOKENMAXX — Kwatro board-ui names leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 45 kwatro — board-ui names', () => {
  it('distinct seat names', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
