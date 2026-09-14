/**
 * Wave 41 — Calla AI analyzeMoves / getAIMove / isAITurn leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  type CallaGameState,
} from '../../src/games/calla/types';
import { makeMove, getValidPits } from '../../src/games/calla/rules';
import {
  analyzeMoves,
  getAIMove,
  isAITurn,
} from '../../src/games/calla/ai';

describe('Wave 41 Calla — AI analyze and move', () => {
  it('analyzeMoves returns one analysis per valid pit with best marked', () => {
    const state = createInitialState();
    const valids = getValidPits(state);
    const analyses = analyzeMoves(state, 'player1');
    expect(analyses).toHaveLength(valids.length);
    expect(analyses.every((a) => typeof a.score === 'number')).toBe(true);
    expect(analyses.every((a) => a.reasoning.length > 0)).toBe(true);
    expect(analyses.filter((a) => a.isBestMove)).toHaveLength(1);
    expect(analyses[0].isBestMove).toBe(true);
    expect(analyses[0].isGoodMove).toBe(true);
  });

  it('analyzeMoves includes capture reasoning when capture available', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 5, 0],
    };
    const analyses = analyzeMoves(state, 'player1');
    expect(analyses).toHaveLength(1);
    expect(analyses[0].outcome.captureAmount).toBeGreaterThan(0);
    expect(analyses[0].reasoning.toLowerCase()).toMatch(/captur/);
  });

  it('getAIMove returns a valid pit for easy/medium/hard', () => {
    const state = createInitialState();
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(state, 'player1', diff);
      expect(move).not.toBeNull();
      expect(getValidPits(state)).toContain(move!.pit);
    }
  });

  it('getAIMove null when not AI seat or game over', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    const over: CallaGameState = {
      ...state,
      phase: 'gameOver',
      winner: 'player1',
    };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
  });

  it('isAITurn gates on mode, seat, and gameOver', () => {
    const state = createInitialState();
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    const after = makeMove(state, 0);
    if (after.currentPlayer === 'player2') {
      expect(isAITurn(after, 'player2', 'human-vs-ai')).toBe(true);
    }
  });

  it('AI move applied via makeMove advances history', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard')!;
    const next = makeMove(state, move.pit);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].pitIndex).toBe(move.pit);
  });
});
