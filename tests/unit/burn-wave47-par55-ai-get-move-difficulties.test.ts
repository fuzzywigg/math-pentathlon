/**
 * Wave 47 leftover after #214/#215 — Par 55 getAIMove difficulty + Math.random leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, getValidPlacements } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';

describe('Wave 47 par deepen 5 — Wave 47 par55 — getAIMove difficulties', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null for wrong seat', () => {
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'medium')).toBeNull();
  });

  it('returns null when phase is gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(state, 'player1', 'hard')).toBeNull();
  });

  it('hard difficulty picks top move when random is above threshold', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(state.hands.player1.some((b) => b.id === move!.blockId)).toBe(true);
    expect(getValidPlacements(state)).toContain(move!.baseId);
  });

  it('medium difficulty may pick from top three when random is low', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.blockId).toBeTruthy();
    expect(move!.baseId).toBeTruthy();
  });

  it('easy teaching mode returns legal move with random suboptimal path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(getValidPlacements(state)).toContain(move!.baseId);
  });
});
