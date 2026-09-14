/**
 * Wave 47 leftover after #214/#215 leftovers D — Hex-a-Gone AI late-game selection. Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getAISelection } from '../../src/games/hex-a-gone/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 47 hex-a-gone deepen 7 — D hexagone — AI late-game selection size', () => {
  it('selection length never exceeds remaining empty cells', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    // Leave exactly 2 empty cells
    let kept = 0;
    state = {
      ...state,
      board: state.board.map((cell) => {
        if (kept < 2) {
          kept++;
          return cell;
        }
        return {
          ...cell,
          filled: true,
          filledBy: 'player2' as const,
          blockId: 1,
        };
      }),
    };
    const empties = state.board.filter((c) => !c.filled).length;
    expect(empties).toBe(2);

    const sel = getAISelection(state, 'player1', 'hard');
    expect(sel).not.toBeNull();
    expect(sel!.blocks.length).toBeGreaterThan(0);
    expect(sel!.blocks.length).toBeLessThanOrEqual(empties);
  });
});
