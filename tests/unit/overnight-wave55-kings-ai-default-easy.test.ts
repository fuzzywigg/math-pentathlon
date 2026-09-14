/**
 * Wave 55 leftover after #250 — Kings getAIMove default switch falls to easy. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { getAIMove, type AIDifficulty } from '../../src/games/kings-quadraphages/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 55 kings — AI default difficulty', () => {
  it('unknown difficulty matches easy', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialGameState();
    const easy = getAIMove(state, 'player1', 'easy');
    const fallback = getAIMove(state, 'player1', 'bogus' as AIDifficulty);
    expect(fallback).toEqual(easy);
    expect(easy?.kingMove).toBeTruthy();
  });
});
