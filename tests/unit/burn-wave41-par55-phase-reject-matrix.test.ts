/**
 * Wave 41 — Par 55 phase guards + missing-base score reject.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  clearSelection,
  isValidPlacement,
  calculateScore,
  placeBlock,
  passTurn,
  hasValidMoves,
} from '../../src/games/par-55/rules';
import { executeAITurn, getAIMove } from '../../src/games/par-55/ai';
import { countMatchingAttributes, createBlockSet } from '../../src/games/par-55/types';

describe('Wave 41 Par 55 — phase reject matrix', () => {
  it('selectBlock identity when placingBlock / gameOver', () => {
    const base = createInitialState();
    const id = base.hands.player1[0].id;
    const placing = { ...base, phase: 'placingBlock' as const, selectedBlock: id };
    expect(selectBlock(placing, id)).toBe(placing);
    const over = { ...base, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(selectBlock(over, id)).toBe(over);
  });

  it('selectBlock unknown id identity; clearSelection resets phase', () => {
    const base = createInitialState();
    expect(selectBlock(base, 'no-such-block')).toBe(base);
    const selected = selectBlock(base, base.hands.player1[0].id);
    expect(selected.phase).toBe('placingBlock');
    const cleared = clearSelection(selected);
    expect(cleared.selectedBlock).toBeNull();
    expect(cleared.phase).toBe('selectingBlock');
  });

  it('isValidPlacement ghost / empty isolated base → false', () => {
    const state = createInitialState();
    expect(isValidPlacement(state, 'ghost-base')).toBe(false);
  });

  it('calculateScore missing base → zero', () => {
    const state = createInitialState();
    const block = state.hands.player1[0];
    expect(calculateScore(state, block, 'missing')).toEqual({
      totalPoints: 0,
      matchDetails: [],
    });
  });

  it('placeBlock identity when selectedBlock not in hand', () => {
    const state = createInitialState();
    const forged = {
      ...state,
      phase: 'placingBlock' as const,
      selectedBlock: 'not-in-hand',
    };
    const anyBase = [...forged.bases.keys()][0];
    expect(placeBlock(forged, anyBase)).toBe(forged);
  });

  it('passTurn flips seat; empty-hand AI returns null then execute passes', () => {
    const state = createInitialState();
    const empty = {
      ...state,
      hands: { ...state.hands, player1: [] as typeof state.hands.player1 },
    };
    expect(hasValidMoves(empty)).toBe(false);
    expect(getAIMove(empty, 'player1', 'hard')).toBeNull();
    const next = executeAITurn(empty, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBlock');
  });

  it('countMatchingAttributes all-four and zero-overlap', () => {
    const blocks = createBlockSet();
    const a = blocks[0];
    expect(countMatchingAttributes(a, a).length).toBe(4);
    const other = blocks.find(
      (b) =>
        b.shape !== a.shape &&
        b.color !== a.color &&
        b.number !== a.number &&
        b.pattern !== a.pattern
    );
    if (other) {
      expect(countMatchingAttributes(a, other)).toEqual([]);
    }
  });
});
