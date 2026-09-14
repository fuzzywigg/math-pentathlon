/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball getPlayerName Blue leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 55 pinball board — player name', () => {
  it('maps seats leftover', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
