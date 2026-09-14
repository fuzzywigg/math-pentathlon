/**
 * Wave 47 leftover after #214/#215 leftovers D — Hex-a-Gone AI empty bank null. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
} from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  getAIPlacement,
  executeAITurn,
} from '../../src/games/hex-a-gone/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 47 hex-a-gone deepen 6 — hexagone — AI empty bank / full board / null gates', () => {
  it('bank all 0 → getAISelection empty-score path or empty blocks', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createInitialState(),
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 0,
        square: 0,
      },
    };
    const sel = getAISelection(state, 'player1', 'medium');
    // evaluateSelections returns [{ blocks: [], score: -1000 }] when maxBlocks===0
    expect(sel).not.toBeNull();
    expect(sel!.blocks).toEqual([]);
  });

  it('board full → getAISelection empty blocks path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    for (const cell of state.board) cell.filled = true;
    const sel = getAISelection(state, 'player1', 'hard');
    expect(sel).not.toBeNull();
    expect(sel!.blocks).toEqual([]);
  });

  it('getAIPlacement null when not placeBlocks or wrong seat', () => {
    const open = createInitialState();
    expect(getAIPlacement(open, 'player1', 'easy')).toBeNull();

    let placing = selectBlock(open, 'triangle');
    placing = commitSelection(placing);
    expect(getAIPlacement(placing, 'player2', 'easy')).toBeNull();
  });

  it('executeAITurn does not hang on empty bank', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createInitialState(),
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 0,
        square: 0,
      },
    };
    const after = executeAITurn(state, 'player1', 'medium');
    // Empty selection → commitSelection no-op → stays selectBlocks
    expect(after.phase).toBe('selectBlocks');
  });
});
