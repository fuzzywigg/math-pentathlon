/**
 * Wave 49 leftover after #221/#226/#227 — Contig getPlayerName Blue/Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — Blue/Red names', () => {
  it('maps seats to Blue and Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
