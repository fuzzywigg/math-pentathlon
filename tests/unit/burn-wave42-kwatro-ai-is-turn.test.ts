/**
 * Wave 42 — Kwatro-Sinko isAITurn matrix including selectingDest phase. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  passTurn,
} from '../../src/games/kwatro-sinko/rules';
import { isAITurn } from '../../src/games/kwatro-sinko/ai';

describe('Wave 42 kwatro-sinko — AI is turn matrix', () => {
  it('human-vs-human never counts as AI turn', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
  });

  it('human-vs-ai true when currentPlayer matches aiPlayer in selectingChip', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('human-vs-ai true during selectingDest before move resolves', () => {
    const dest = selectChip(createInitialState(), 'p1-0');
    expect(dest.phase).toBe('selectingDest');
    expect(isAITurn(dest, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(dest, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('false when aiPlayer null, gameOver, or opponent seat after pass', () => {
    const over = { ...createInitialState(), phase: 'gameOver' as const, winner: 'player1' as const };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
    expect(isAITurn(createInitialState(), null, 'human-vs-ai')).toBe(false);

    const p2 = passTurn(createInitialState());
    expect(isAITurn(p2, 'player1', 'human-vs-ai')).toBe(false);
    expect(isAITurn(p2, 'player2', 'human-vs-ai')).toBe(true);
  });
});
