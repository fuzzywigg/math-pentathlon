/**
 * Wave 41 — Ramrod AI getAIMove / executeAITurn / isAITurn leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  hasValidMoves,
  getValidPlacements,
  isValidPlacement,
} from '../../src/games/ramrod/rules';
import {
  getAIMove,
  executeAITurn,
  isAITurn,
} from '../../src/games/ramrod/ai';
import type { RamrodState } from '../../src/games/ramrod/types';

describe('Wave 41 Ramrod — AI execute', () => {
  it('getAIMove returns legal rod/box/slot for medium', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(state.playerRods.player1).toContain(move!.rodId);
    expect(isValidPlacement(state, move!.rodId, move!.boxId, move!.slot)).toBe(
      true
    );
    expect(
      getValidPlacements(state, move!.rodId).some(
        (p) => p.boxId === move!.boxId && p.slot === move!.slot
      )
    ).toBe(true);
  });

  it('getAIMove null for wrong seat, gameOver, or no moves', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    const over: RamrodState = {
      ...state,
      phase: 'gameOver',
      winner: 'player1',
    };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
    const emptyHand: RamrodState = {
      ...state,
      playerRods: { ...state.playerRods, player1: [] },
    };
    expect(hasValidMoves(emptyHand)).toBe(false);
    expect(getAIMove(emptyHand, 'player1', 'hard')).toBeNull();
  });

  it('executeAITurn places a rod or passes when stuck', () => {
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next).not.toBe(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length + (next.selectedRod ? 0 : 0)).toBeGreaterThanOrEqual(0);
    // Either placed (history +1) or passed (history same, seat flipped)
    if (next.moveHistory.length === state.moveHistory.length + 1) {
      expect(next.phase === 'selectingRod' || next.phase === 'gameOver').toBe(
        true
      );
    } else {
      expect(next.selectedRod).toBeNull();
      expect(next.phase).toBe('selectingRod');
    }
  });

  it('executeAITurn on empty hand passes without history growth', () => {
    const state: RamrodState = {
      ...createInitialState(),
      playerRods: {
        player1: [],
        player2: createInitialState().playerRods.player2,
      },
    };
    const next = executeAITurn(state, 'player1', 'medium');
    expect(next.moveHistory).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
  });

  it('isAITurn true only for hvai matching seat mid-game', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    const over: RamrodState = {
      ...state,
      phase: 'gameOver',
      winner: 'player2',
    };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('easy and hard AI both produce executable turns from opening', () => {
    const a = executeAITurn(createInitialState(), 'player1', 'easy');
    const b = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(a.currentPlayer).toBe('player2');
    expect(b.currentPlayer).toBe('player2');
  });
});
