/**
 * Wave 42 — FIAR board-ui name/color helpers (leftover chrome). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName, getPlayerColor } from '../../src/games/fiar/board-ui';

describe('Wave 42 fiar — board-ui helpers', () => {
  it('names and colors distinct per seat', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
    expect(getPlayerColor('player1')).not.toBe(getPlayerColor('player2'));
    expect(getPlayerColor('player1').length).toBeGreaterThan(0);
  });
});
