/**
 * Wave 57 leftover after #263 — Par 55 getPlayerName Blue/Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/par-55/board-ui';

describe('Wave 57 par55 — getPlayerName', () => {
  it('maps player1/player2 to Blue/Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
