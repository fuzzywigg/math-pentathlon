/**
 * Wave 43 TOKENMAXX — Sum Dominoes opening center seed leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 sum-dominoes — center seed', () => {
  it('opens rolling with center occupied and hands of 7', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(state.hands.player1).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(state.hands.player2).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    // Opening seed occupies the center anchor cell (second cell may be unset).
    expect(state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]).not.toBeNull();
    expect(state.passCount).toBe(0);
    expect(state.winner).toBeNull();
    expect(state.currentDice).toBeNull();
  });
});
