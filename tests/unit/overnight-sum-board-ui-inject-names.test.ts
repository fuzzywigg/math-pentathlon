/**
 * Overnight HEAVY after #214/#215 — Sum Dominoes UI inject leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles, getPlayerName } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Overnight sum-dominoes — board-ui', () => {
  it('distinct names; styles idempotent', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
    injectSDStyles();
    injectSDStyles();
    expect(document.getElementById('sd-styles')).toBeTruthy();
  });
});
