/**
 * Wave 55 leftover after #249/#250 — Fab AI short pool null + commutative pair order. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove, executeAITurn } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 55 fab — AI short pool', () => {
  it('single leftover bar yields null move and passTurn seat flip', () => {
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    const ids = [...bars.keys()];
    for (let i = 0; i < ids.length - 1; i++) {
      bars.set(ids[i], { ...bars.get(ids[i])!, used: true });
    }
    const jammed = { ...state, fractionBars: bars };
    expect(getAIMove(jammed, 'player1', 'hard')).toBeNull();
    const next = executeAITurn(jammed, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
  });

  it('add/multiply AI picks keep bar1Id <= bar2Id (commutative skip)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIMove(createInitialState(), 'player1', 'hard');
    expect(move).not.toBeNull();
    if (move && (move.operation === 'add' || move.operation === 'multiply')) {
      expect(move.bar1Id <= move.bar2Id).toBe(true);
    }
  });
});
