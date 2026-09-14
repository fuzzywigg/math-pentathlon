/**
 * Wave 45 — Prime Gold executeAITurn roll+place leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { executeAITurn, isAITurn } from '../../src/games/prime-gold/ai';

describe('Wave 45 prime — executeAITurn', () => {
  afterEach(() => vi.restoreAllMocks());

  it('rolling → places and flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length).toBe(1);
  });

  it('isAITurn matrix', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
  });
});
