/**
 * Wave 43 — Sum Dominoes board-ui seat names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 43 sum-dominoes — ui names', () => {
  it('Blue vs Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
