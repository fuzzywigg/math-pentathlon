/**
 * Wave 49 — Contig getPlayerName exact Blue/Red leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — Blue/Red exact', () => {
  it('maps seats to Blue and Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
