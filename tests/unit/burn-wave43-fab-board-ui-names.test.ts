/**
 * Wave 43 TOKENMAXX — Fab board-ui name helper leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 43 fab — board-ui names', () => {
  it('distinct non-empty names per seat', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
    expect(getPlayerName('player1').length).toBeGreaterThan(0);
  });
});
