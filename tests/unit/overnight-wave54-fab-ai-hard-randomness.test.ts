/**
 * Wave 54 leftover after #240 — Fab hard AI randomness vs top pick. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 54 fab — hard randomness', () => {
  it('hard with random below 0.03 still returns a legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const move = getAIMove(createInitialState(), 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.bar1Id).not.toBe(move!.bar2Id);
  });

  it('hard with random above 0.03 returns top-scoring shape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIMove(createInitialState(), 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(['add', 'subtract', 'multiply', 'divide']).toContain(move!.operation);
  });
});
