/**
 * Wave 42 — Pinball board-ui player name helper. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 42 pinball — ui names', () => {
  it('seat names differ', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
