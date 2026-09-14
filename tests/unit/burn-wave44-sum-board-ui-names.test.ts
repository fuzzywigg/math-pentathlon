/**
 * Wave 44 — Sum Dominoes board-ui name leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 44 Sum Dominoes — board-ui names', () => {
  it('distinct seat labels', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
  });
});
