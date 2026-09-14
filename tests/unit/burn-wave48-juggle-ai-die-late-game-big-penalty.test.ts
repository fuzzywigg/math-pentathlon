/**
 * Wave 48 — Juggle late-game large-shape penalty still returns a choice. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';
import { CONFIG } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — late-game die penalty', () => {
  it('nearly full board still yields a die index', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const board = s.boards.player1;
    // fill all but 3 cells
    let left = 3;
    for (let r = 0; r < CONFIG.GRID_SIZE; r++) {
      for (let c = 0; c < CONFIG.GRID_SIZE; c++) {
        if (left > 0) {
          left--;
          continue;
        }
        board.cells[r][c] = true;
      }
    }
    const selecting = {
      ...s,
      boards: { ...s.boards, player1: board },
      phase: 'selectingShape' as const,
      currentDice: [5, 1] as [number, number],
    };
    const choice = getAIDieChoice(selecting, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.index);
  });
});
