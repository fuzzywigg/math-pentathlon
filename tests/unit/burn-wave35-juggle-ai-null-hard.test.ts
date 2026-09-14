/**
 * Wave 35 — Juggle AI hard null gates (gameOver / wrong seat / hvh).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement,
  isAITurn,
} from '../../src/games/juggle/ai';

describe('Wave 35 Juggle — AI null hard', () => {
  it('nulls die/shape/placement choices on gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      currentDice: [3, 4] as [number, number],
      selectedCategory: 'tromino' as const,
      selectedShape: null,
    };
    expect(getAIDieChoice(state, 'player1', 'hard')).toBeNull();
    expect(getAIShapeChoice(state, 'player1', 'hard')).toBeNull();
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();
  });

  it('nulls choices for wrong seat even with live dice', () => {
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [2, 5] as [number, number],
      currentPlayer: 'player1' as const,
    };
    expect(getAIDieChoice(state, 'player2', 'medium')).toBeNull();
    expect(getAIShapeChoice(state, 'player2', 'medium')).toBeNull();
    expect(getAIPlacement(state, 'player2', 'medium')).toBeNull();
  });

  it('isAITurn false for human-vs-human regardless of seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
  });
});
