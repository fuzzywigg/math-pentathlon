/**
 * Wave 42 — FIAR applyAIMove place records history + flips seat.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — apply place history', () => {
  it('hard place via applyAIMove updates chipsPlaced', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy')!;
    const next = applyAIMove(state, move);
    expect(next.chipsPlaced.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory[0].type).toBe('place');
    expect(next.moveHistory[0].nodeId).toBe(move.nodeId);
  });
});
