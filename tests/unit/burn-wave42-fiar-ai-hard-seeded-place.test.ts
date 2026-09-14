/**
 * Wave 42 — FIAR seeded hard/medium legal place on opening. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { getAIMove, applyAIMove } from '../../src/games/fiar/ai';
import { canPlaceChip } from '../../src/games/fiar/rules';
import { createInitialState } from '../../src/games/fiar/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 fiar — AI hard/medium seeded place', () => {
  it('seeded medium returns legal place on opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
    expect(state.board.nodes.get(move!.nodeId!)?.chip).toBeNull();
  });

  it('seeded hard returns legal place on opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(canPlaceChip(state, move!.nodeId!)).toBe(true);
  });

  it('applyAIMove of seeded hard place advances chipsPlaced', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    const next = applyAIMove(state, move!);
    expect(next.chipsPlaced.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.board.nodes.get(move!.nodeId!)?.chip).toBe('player1');
  });

  it('low-randomness seed still yields a place type on medium', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move?.type).toBe('place');
    expect(typeof move?.nodeId).toBe('string');
  });
});
