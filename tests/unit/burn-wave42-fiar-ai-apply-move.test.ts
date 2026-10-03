/**
 * Wave 42 — FIAR applyAIMove for movement type.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import { placeToMovement } from './fiar-test-helpers';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 FIAR AI — apply move', () => {
  it('applyAIMove relocates chip and advances seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = placeToMovement();
    const seat = state.currentPlayer;
    const move = getAIMove(state, seat, 'easy')!;
    const next = applyAIMove(state, move);
    expect(next.board.nodes.get(move.from!)?.chip).toBeNull();
    expect(next.board.nodes.get(move.to!)?.chip).toBe(seat);
    expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
    // Win ends game without seat advance; otherwise seat flips
    if (!next.winner) {
      expect(next.currentPlayer).not.toBe(seat);
    }
  });

  it('applyAIMove identity on incomplete move payload', () => {
    const state = createInitialState();
    expect(applyAIMove(state, { type: 'move' })).toBe(state);
    expect(applyAIMove(state, { type: 'move', from: '0-0' })).toBe(state);
  });
});
