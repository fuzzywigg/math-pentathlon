/**
 * Wave 47 leftover after #214/#215 — Stars & Bars AI execute / difficulty leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, hasValidMoves } from '../../src/games/stars-bars/rules';
import {
  getAIMove,
  executeAITurn,
  isAITurn,
} from '../../src/games/stars-bars/ai';
import type { StarsState } from '../../src/games/stars-bars/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 47 stars deepen 1 — Stars AI — gates', () => {
  it('isAITurn matrix', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(s, null, 'human-vs-ai')).toBe(false);
    expect(
      isAITurn({ ...s, phase: 'gameOver' }, 'player1', 'human-vs-ai')
    ).toBe(false);
    expect(
      isAITurn({ ...s, currentPlayer: 'player2' }, 'player2', 'human-vs-ai')
    ).toBe(true);
  });

  it('getAIMove null for wrong seat / gameOver / empty hand', () => {
    const s = createInitialState();
    expect(getAIMove(s, 'player2', 'hard')).toBeNull();
    expect(
      getAIMove({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1', 'easy')
    ).toBeNull();
    const empty: StarsState = {
      ...s,
      playerHands: { player1: [], player2: s.playerHands.player2 },
    };
    expect(hasValidMoves(empty)).toBe(false);
    expect(getAIMove(empty, 'player1', 'medium')).toBeNull();
  });
});

describe('Wave 47 Stars AI — difficulties / execute', () => {
  it.each(['easy', 'medium', 'hard'] as const)(
    'difficulty %s returns placeable card+cell on opening',
    (difficulty) => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      const state = createInitialState();
      const move = getAIMove(state, 'player1', difficulty);
      expect(move).not.toBeNull();
      expect(state.playerHands.player1.some((c) => c.id === move!.cardId)).toBe(
        true
      );
      expect(move!.row).toBeGreaterThanOrEqual(0);
      expect(move!.col).toBeGreaterThanOrEqual(0);
      expect(move!.row).toBeLessThan(5);
      expect(move!.col).toBeLessThan(5);
    }
  );

  it('randomness branch (seed 0) still returns a legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
  });

  it.each(['easy', 'medium', 'hard'] as const)(
    'executeAITurn %s advances seat and records history',
    (difficulty) => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const state = createInitialState();
      const next = executeAITurn(state, 'player1', difficulty);
      expect(next.currentPlayer).toBe('player2');
      expect(next.moveHistory.length).toBe(1);
      expect(next.selectedCard).toBeNull();
      expect(next.phase).toBe('selectingCard');
    }
  );

  it('executeAITurn wrong seat → passTurn (no history)', () => {
    const state = createInitialState();
    const next = executeAITurn(state, 'player2', 'hard');
    expect(next.moveHistory).toHaveLength(0);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingCard');
  });

  it('player2 AI turn places and returns to player1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
    };
    const next = executeAITurn(state, 'player2', 'medium');
    expect(next.currentPlayer).toBe('player1');
    expect(next.moveHistory.length).toBe(1);
  });
});
