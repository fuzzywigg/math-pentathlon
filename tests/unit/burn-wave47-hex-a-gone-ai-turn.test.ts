/**
 * Wave 47 leftover after #214/#215 — Hex-a-Gone AI selection/placement/execute leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  canPlaceAt,
  isGameOver,
} from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  getAIPlacement,
  executeAITurn,
  isAITurn,
} from '../../src/games/hex-a-gone/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 47 hex-a-gone deepen 0 — hex-a-gone — AI getAISelection / placement / execute / isAITurn', () => {
  it('getAISelection returns 1-3 available blocks on opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const sel = getAISelection(state, 'player1', 'medium');
    expect(sel).not.toBeNull();
    expect(sel!.blocks.length).toBeGreaterThanOrEqual(1);
    expect(sel!.blocks.length).toBeLessThanOrEqual(3);
    expect(new Set(sel!.blocks).size).toBe(sel!.blocks.length);
  });

  it('getAIPlacement returns on-board empty coords after commit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    const place = getAIPlacement(state, 'player1', 'hard');
    expect(place).not.toBeNull();
    expect(canPlaceAt(state, place!.q, place!.r)).toBe(true);
  });

  it('executeAITurn completes selection+placement and leaves select for opponent or over', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const before = createInitialState();
    const after = executeAITurn(before, 'player1', 'medium');
    expect(after.moveHistory.length).toBeGreaterThanOrEqual(1);
    if (isGameOver(after)) {
      expect(after.winner).toBeTruthy();
    } else {
      expect(after.phase).toBe('selectBlocks');
      expect(after.currentPlayer).toBe('player2');
      expect(after.turnSelection.blocks).toEqual([]);
    }
  });

  it('isAITurn true only for human-vs-ai matching seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
  });

  it('getAISelection null wrong phase/seat; getAIPlacement null wrong phase', () => {
    const open = createInitialState();
    expect(getAISelection(open, 'player2', 'easy')).toBeNull();
    expect(getAIPlacement(open, 'player1', 'easy')).toBeNull();

    let placing = selectBlock(open, 'square');
    placing = commitSelection(placing);
    expect(getAISelection(placing, 'player1', 'easy')).toBeNull();
  });
});
