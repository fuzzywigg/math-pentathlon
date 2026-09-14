/**
 * Overnight HEAVY after #210 — Remainder isAITurn true while choice gated on phase.
 * #210 covered gameOver false + opening true; rolling asymmetry untouched.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAIIslandChoice,
  executeAISelection,
  isAITurn,
} from '../../src/games/remainder-islands/ai';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Overnight remainder — isAITurn rolling vs choice', () => {
  it('rolling phase: isAITurn true but getAIIslandChoice null / execute identity', () => {
    const rolling = createInitialState();
    expect(rolling.phase).toBe('rolling');
    expect(rolling.currentPlayer).toBe('player1');
    expect(isAITurn(rolling, 'player1')).toBe(true);
    expect(getAIIslandChoice(rolling, 'player1', 'hard')).toBeNull();
    expect(executeAISelection(rolling, 'player1', 'hard')).toBe(rolling);
  });
});
