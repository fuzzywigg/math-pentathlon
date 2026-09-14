/**
 * Wave 35 — Calla wrong-seat / empty-pit identity + AI seat gates.
 * Distinct from wave14/15 phase matrices and wave16 opening AI nulls.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  CallaGameState,
} from '../../src/games/calla/types';
import {
  canSelectPit,
  getValidPits,
  makeMove,
  isGameOver,
} from '../../src/games/calla/rules';
import { getAIMove, isAITurn } from '../../src/games/calla/ai';

describe('Wave 35 Calla — illegal seat', () => {
  it('canSelectPit is false for non-current seat on every pit', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    for (let i = 0; i < 5; i++) {
      expect(canSelectPit(state, 'player2', i)).toBe(false);
      expect(canSelectPit(state, 'player1', i)).toBe(true);
    }
  });

  it('makeMove on empty pit is identity; game stays selectPit', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 3, 3, 3, 3],
    };
    expect(makeMove(state, 0)).toBe(state);
    expect(state.phase).toBe('selectPit');
  });

  it('isAITurn false for hvh and wrong seat; getAIMove null for wrong seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    expect(getAIMove(state, 'player1', 'medium')).not.toBeNull();
  });

  it('getAIMove null on gameOver even if forged currentPlayer matches AI', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
      currentPlayer: 'player2',
    };
    expect(isGameOver(state)).toBe(true);
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('getValidPits ignores wrong-seat framing and only uses currentPlayer pits', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 2, 0, 0],
      player2Pits: [4, 4, 4, 4, 4],
    };
    expect(getValidPits(state)).toEqual([2]);
  });
});
