/**
 * Wave 41 — Fab-a-Diffy AI execute / applyAIMoveSteps leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import {
  getAIMove,
  isAITurn,
  executeAITurn,
  applyAIMoveSteps,
  type AIMove,
} from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Fab AI — gates', () => {
  it('isAITurn matrix', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(
      isAITurn({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1', 'human-vs-ai')
    ).toBe(false);
  });

  it('getAIMove null wrong seat / gameOver', () => {
    const s = createInitialState();
    expect(getAIMove(s, 'player2', 'hard')).toBeNull();
    expect(
      getAIMove({ ...s, phase: 'gameOver', winner: 'player2' }, 'player1', 'easy')
    ).toBeNull();
  });
});

describe('Wave 41 Fab AI — difficulties / steps', () => {
  it.each(['easy', 'medium', 'hard'] as const)(
    'difficulty %s returns concrete bars/op/answer',
    (difficulty) => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      const state = createInitialState();
      const move = getAIMove(state, 'player1', difficulty);
      expect(move).not.toBeNull();
      expect(state.fractionBars.has(move!.bar1Id)).toBe(true);
      expect(state.fractionBars.has(move!.bar2Id)).toBe(true);
      expect(move!.bar1Id).not.toBe(move!.bar2Id);
      expect(state.answerBars.has(move!.answerId)).toBe(true);
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(move!.operation);
    }
  );

  it.each(['easy', 'medium', 'hard'] as const)(
    'executeAITurn %s records history and flips to player2',
    (difficulty) => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const next = executeAITurn(createInitialState(), 'player1', difficulty);
      expect(next.moveHistory.length).toBe(1);
      expect(next.currentPlayer).toBe('player2');
      expect(next.phase).toBe('selectingBar1');
      expect(next.scores.player1).toBe(1);
    }
  );

  it('executeAITurn wrong seat → pass without history', () => {
    const next = executeAITurn(createInitialState(), 'player2', 'hard');
    expect(next.moveHistory).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
  });

  it('applyAIMoveSteps happy path claims answer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = applyAIMoveSteps(state, move!);
    expect(next.moveHistory.length).toBe(1);
    expect(next.answerBars.get(move!.answerId)?.claimedBy).toBe('player1');
  });

  it('applyAIMoveSteps fails selectBar1 → passTurn', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const state = createInitialState();
    const bad: AIMove = {
      bar1Id: 'missing',
      bar2Id: [...state.fractionBars.keys()][0],
      operation: 'add',
      answerId: [...state.answerBars.keys()][0],
    };
    const next = applyAIMoveSteps(state, bad);
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(0);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('applyAIMoveSteps fails executeMove → passTurn', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const next = applyAIMoveSteps(state, {
      ...move!,
      answerId: 'totally-missing-answer',
    });
    expect(next.moveHistory).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
    expect(errorSpy).toHaveBeenCalled();
  });
});
