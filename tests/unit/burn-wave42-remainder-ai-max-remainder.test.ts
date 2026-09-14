/** Wave 42 — Remainder AI prefers max remainder. Tests-only. */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  getAIIslandChoice,
  executeAISelection,
} from '../../src/games/remainder-islands/ai';
import { calculateDivision } from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 remainder — AI max remainder', () => {
  it('hard picks island with highest remainder among valids', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const base = createInitialState();
    // total 11: value 6 → rem 5; value 8 → rem 3; value 2 → rem 1
    const high = base.islands.find((i) => i.value === 6)!;
    const mid = base.islands.find((i) => i.value === 8)!;
    const low = base.islands.find((i) => i.value === 2)!;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 5, die2: 6, total: 11 },
      validIslands: [low.id, mid.id, high.id],
    };
    const choice = getAIIslandChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    const rem = (id: string) => {
      const island = state.islands.find((i) => i.id === id)!;
      return calculateDivision(11, island.value).remainder;
    };
    const chosenRem = rem(choice!.islandId);
    expect(chosenRem).toBe(Math.max(rem(low.id), rem(mid.id), rem(high.id)));
    expect(choice!.islandId).toBe(high.id);
  });

  it('executeAISelection applies the max-remainder choice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const base = createInitialState();
    const high = base.islands.find((i) => i.value === 6)!;
    const low = base.islands.find((i) => i.value === 2)!;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 5, die2: 6, total: 11 },
      validIslands: [low.id, high.id],
    };
    const next = executeAISelection(state, 'player1', 'hard');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].island.id).toBe(high.id);
    expect(next.player1Score).toBe(11 % 6);
  });

  it('medium with randomness off also prefers high remainder', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const base = createInitialState();
    const a = base.islands.find((i) => i.value === 5)!; // 11%5 = 1
    const b = base.islands.find((i) => i.value === 7)!; // 11%7 = 4
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 5, die2: 6, total: 11 },
      validIslands: [a.id, b.id],
    };
    const choice = getAIIslandChoice(state, 'player1', 'medium');
    expect(choice?.islandId).toBe(b.id);
  });

  it('single valid island is chosen regardless of remainder', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const base = createInitialState();
    const only = base.islands.find((i) => i.value === 9)!;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 3, total: 6 },
      validIslands: [only.id],
    };
    expect(getAIIslandChoice(state, 'player1', 'hard')?.islandId).toBe(only.id);
  });
});
