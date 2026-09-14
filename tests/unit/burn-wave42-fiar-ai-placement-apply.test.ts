/**
 * Wave 42 — FIAR AI getAIMove placement + applyAIMove. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import { createInitialState } from '../../src/games/fiar/types';
import { canPlaceChip } from '../../src/games/fiar/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 fiar — AI placement apply', () => {
  it('getAIMove returns a legal place move in placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(move!.nodeId).toBeTruthy();
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
  });

  it('applyAIMove applies place and flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    const next = applyAIMove(state, move!);
    expect(next.board.nodes.get(move!.nodeId!)?.chip).toBe('player1');
    expect(next.currentPlayer).toBe('player2');
    expect(next.chipsPlaced.player1).toBe(1);
    expect(next.moveHistory).toHaveLength(1);
  });

  it('applyAIMove with incomplete place object is identity', () => {
    const state = createInitialState();
    expect(applyAIMove(state, { type: 'place' })).toBe(state);
  });
});
