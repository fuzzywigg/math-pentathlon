/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact getPlayerName Red leftover.
 * Wave52 handshake names; this pins player2 exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/frac-fact/board-ui';

describe('Wave 55 frac board — player name Red', () => {
  it('maps player2 to Red', () => {
    expect(getPlayerName('player2')).toBe('Red');
    expect(getPlayerName('player1')).toBe('Blue');
  });
});
