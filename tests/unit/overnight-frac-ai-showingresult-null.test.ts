/**
 * Overnight TOKENMAXX HEAVY — frac-fact AI showingResult null leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { getAIAnswer, isAITurn } from '../../src/games/frac-fact/ai';

describe('Overnight frac-fact — AI phase gates', () => {
  it('getAIAnswer null when showingResult', () => {
    const state = { ...createInitialState(), phase: 'showingResult' as const };
    expect(getAIAnswer(state, 'player1', 'hard')).toBeNull();
  });

  it('isAITurn false when phase is not playing', () => {
    const state = { ...createInitialState(), phase: 'gameOver' as const, currentPlayer: 'player2' as const };
    expect(isAITurn(state, 'player2')).toBe(false);
  });

  it('isAITurn true when playing and seat matches', () => {
    const open = createInitialState();
    const playing = { ...open, phase: 'playing' as const, currentPlayer: 'player2' as const };
    expect(isAITurn(playing, 'player2')).toBe(true);
    expect(isAITurn(playing, null)).toBe(false);
  });
});
