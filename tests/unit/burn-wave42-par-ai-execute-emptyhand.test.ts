/**
 * Wave 42 — Par-55 AI execute + empty-hand pass path (leftover vs #187). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIMove, executeAITurn, isAITurn } from '../../src/games/par-55/ai';
import {
  createInitialState,
  selectBlock,
  getValidPlacements,
  hasValidMoves,
  passTurn,
} from '../../src/games/par-55/rules';

describe('Wave 42 par-55 — AI execute', () => {
  it('AI move selects hand block and valid base', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(state.hands.player1.some((b) => b.id === move!.blockId)).toBe(true);
    const sel = selectBlock(state, move!.blockId);
    expect(getValidPlacements(sel)).toContain(move!.baseId);
  });

  it('executeAITurn advances seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    const next = executeAITurn(state, 'player1', 'medium');
    expect(next.currentPlayer === 'player2' || next.phase === 'gameOver').toBe(
      true
    );
  });

  it('empty hand hasValidMoves false; pass flips seat', () => {
    const state = createInitialState();
    const empty = {
      ...state,
      hands: { ...state.hands, player1: [] as typeof state.hands.player1 },
    };
    expect(hasValidMoves(empty)).toBe(false);
    expect(getAIMove(empty, 'player1', 'hard')).toBeNull();
    const passed = passTurn(empty);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.phase).toBe('selectingBlock');
  });

  it('select then placements nonempty near center starter', () => {
    const state = createInitialState();
    const block = state.hands.player1[0];
    const sel = selectBlock(state, block.id);
    expect(sel.phase).toBe('placingBlock');
    expect(getValidPlacements(sel).length).toBeGreaterThan(0);
  });
});
