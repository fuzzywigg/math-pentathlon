/**
 * Play-budget anytime enumeration for Fab-a-Diffy Hard AI (tablet latency).
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import {
  searchAIMove,
  applyAIMoveSteps,
  AI_PLAY_DEADLINE_MS,
} from '../../src/games/fab-a-diffy/ai';

describe('Fab-a-Diffy play-budget search', () => {
  it('exposes a Hard play budget of a few seconds', () => {
    expect(AI_PLAY_DEADLINE_MS.hard).toBeLessThanOrEqual(3000);
    expect(AI_PLAY_DEADLINE_MS.hard).toBeGreaterThan(0);
  });

  it('deadline 0 still returns a legal move when candidates exist', () => {
    const state = createInitialState();
    let ticks = 0;
    const result = searchAIMove(state, 'player1', 'hard', {
      seed: 1,
      deadlineMs: 0,
      now: () => (ticks++ === 0 ? 0 : 1),
    });
    expect(result.move).not.toBeNull();
    expect(result.truncated).toBe(true);
    const next = applyAIMoveSteps(state, result.move!);
    expect(next.moveHistory.length).toBeGreaterThan(state.moveHistory.length);
  });

  it('Hard opening stays near the play budget', () => {
    const state = createInitialState();
    const budget = AI_PLAY_DEADLINE_MS.hard;
    const t0 = performance.now();
    const result = searchAIMove(state, 'player1', 'hard', {
      seed: 1,
      deadlineMs: budget,
    });
    const elapsed = performance.now() - t0;
    expect(result.move).not.toBeNull();
    expect(elapsed).toBeLessThan(budget + 750);
  }, 10_000);

  it('unlimited Hard opening still completes without truncation', () => {
    const state = createInitialState();
    const result = searchAIMove(state, 'player1', 'hard', { seed: 2 });
    expect(result.move).not.toBeNull();
    expect(result.truncated).toBe(false);
  }, 15_000);
});
