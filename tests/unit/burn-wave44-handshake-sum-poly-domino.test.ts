/**
 * Wave 44 — sum starting center × poly domino size handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getRemainingCount } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { SIMPLE_SHAPES, getBoundingBox } from '../../src/core/polyomino';

describe('Wave 44 handshake — sum × poly domino', () => {
  it('center starter exists; poly domino is 2 cells like sum tiles', () => {
    const state = createInitialState();
    const center = state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL];
    expect(center).not.toBeNull();
    expect(center!.orientation).toBe('horizontal');
    expect(getRemainingCount(state, 'player1')).toBe(CONFIG.STARTING_HAND_SIZE);
    const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    expect(domino.size).toBe(2);
    expect(getBoundingBox(domino.cells).width).toBe(2);
  });
});
