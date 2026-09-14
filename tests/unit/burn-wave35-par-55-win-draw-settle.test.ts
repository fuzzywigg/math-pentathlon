/**
 * Wave 35 — Par 55 score settle / empty placements / formatMove.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  getValidPlacements,
  hasValidMoves,
  formatMove,
  getAttributeDisplayName,
  placeBlock,
} from '../../src/games/par-55/rules';
import { getAIMove, isAITurn } from '../../src/games/par-55/ai';
import { CONFIG } from '../../src/games/par-55/types';

describe('Wave 35 Par 55 — win/draw settle', () => {
  it('opening hasValidMoves true and placements after select', () => {
    let state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    const blockId = state.hands.player1[0].id;
    state = selectBlock(state, blockId);
    expect(getValidPlacements(state).length).toBeGreaterThan(0);
  });

  it('formatMove includes pts suffix even for 0', () => {
    const block = createInitialState().hands.player1[0];
    const formatted = formatMove({
      player: 'player1',
      block,
      baseId: 'base',
      pointsScored: 0,
      matchDetails: [],
      moveNumber: 1,
    });
    expect(formatted.toLowerCase()).toMatch(/pt/);
  });

  it('getAttributeDisplayName falls back for unknown', () => {
    expect(getAttributeDisplayName('not-a-real-attr')).toBe('not-a-real-attr');
    expect(getAttributeDisplayName('shape')).toBe('Shape');
  });

  it('forged high score state may settle via place when crossing target', () => {
    let state = createInitialState();
    state = {
      ...state,
      scores: { player1: CONFIG.TARGET_SCORE - 1, player2: 0 },
    };
    const blockId = state.hands.player1[0].id;
    state = selectBlock(state, blockId);
    const bases = getValidPlacements(state);
    if (bases.length === 0) return;
    const next = placeBlock(state, bases[0]);
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(state.moveHistory.length);
    if (next.scores.player1 >= CONFIG.TARGET_SCORE) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
    }
  });

  it('AI null on gameOver; hvh isAITurn false', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getAIMove(over, 'player2', 'hard')).toBeNull();
    expect(isAITurn(createInitialState(), 'player1', 'human-vs-human')).toBe(false);
  });
});
