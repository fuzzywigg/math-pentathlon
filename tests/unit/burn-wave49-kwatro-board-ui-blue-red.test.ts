/**
 * Wave 49 leftover after #221/#226/#227 — Kwatro getPlayerName Blue/Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — Blue/Red names', () => {
  it('maps seats to Blue and Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
