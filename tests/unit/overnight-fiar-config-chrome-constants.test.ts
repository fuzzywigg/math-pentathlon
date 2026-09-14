/**
 * Overnight TOKENMAXX — FIAR CONFIG chrome leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, getOpponent } from '../../src/games/fiar/types';

describe('Overnight fiar — CONFIG constants', () => {
  it('positive chrome invariants and opponent flip', () => {
    expect(CONFIG.CHIPS_PER_PLAYER).toBe(4);
    expect(CONFIG.WIN_LENGTH).toBe(4);
    expect(CONFIG.NODE_RADIUS).toBeGreaterThan(0);
    expect(CONFIG.EDGE_STROKE).toBeGreaterThan(0);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
