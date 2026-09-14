/**
 * Overnight TOKENMAXX — Frac-Fact board-ui names leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/frac-fact/board-ui';

describe('Overnight frac-fact — player names', () => {
  it('Blue/Red exact', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
