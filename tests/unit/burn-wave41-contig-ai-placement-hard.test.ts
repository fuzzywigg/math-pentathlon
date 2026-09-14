/**
 * Wave 41 — Contig AI placement / executeAITurn leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { doRollDice } from '../../src/games/contig-60/rules';
import {
  getAIPlacement,
  isAITurn,
  executeAITurn,
} from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Contig — AI placement', () => {
  it('getAIPlacement null wrong phase', () => {
    expect(getAIPlacement(createInitialState(), 'player1', 'hard')).toBeNull();
  });

  it('getAIPlacement returns placement or null after roll', () => {
    let found = false;
    for (let i = 0; i < 30 && !found; i++) {
      const rolled = doRollDice(createInitialState());
      const placement = getAIPlacement(rolled, 'player1', 'hard');
      if (placement) {
        expect(placement.value).toBeGreaterThan(0);
        expect(placement.expression.length).toBeGreaterThan(0);
        found = true;
      } else {
        // valid when no placements
        expect(placement).toBeNull();
      }
    }
  });

  it('isAITurn gates mode and seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
  });

  it('executeAITurn advances from rolling for AI seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    // After AI turn: either placed (rolling, p2) or passed/gameOver
    expect(['rolling', 'gameOver', 'calculating']).toContain(next.phase);
  });
});
