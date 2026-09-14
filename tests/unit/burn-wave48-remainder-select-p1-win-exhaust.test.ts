/**
 * Wave 48 — Remainder turns exhaust p1 win. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { selectIsland, calculateDivision } from '../../src/games/remainder-islands/rules';

describe('Wave 48 remainder — p1 win exhaust', () => {
  it('p1 ahead when turns hit 0', () => {
    const s = createInitialState();
    const island = s.islands.find((i) => i.value >= 4) ?? s.islands[0];
    const total = island.value * 2 + 3; // remainder 3 when value > 3
    const div = calculateDivision(total, island.value);
    expect(div.remainder).toBe(3);
    const state = {
      ...s,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: 1, total },
      validIslands: [island.id],
      turnsRemaining: 1,
      player1Score: 10,
      player2Score: 0,
    };
    const next = selectIsland(state, island.id);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.player1Score).toBe(13);
  });
});
