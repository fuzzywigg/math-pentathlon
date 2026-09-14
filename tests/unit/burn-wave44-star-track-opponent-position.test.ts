/**
 * Wave 44 — Star Track opponent/position helpers leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOpponent,
  getPlayerPosition,
} from '../../src/games/star-track/types';

describe('Wave 44 Star Track — opponent position', () => {
  it('helpers read per-seat positions', () => {
    const s = { ...createInitialState(), player1Position: 3, player2Position: 7 };
    expect(getPlayerPosition(s, 'player1')).toBe(3);
    expect(getPlayerPosition(s, 'player2')).toBe(7);
    expect(getOpponent('player1')).toBe('player2');
  });
});
