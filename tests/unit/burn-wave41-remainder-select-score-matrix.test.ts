/**
 * Wave 41 — Remainder Islands selectIsland score / ownership / gameOver.
 * Beyond wave39 preview no-ops. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  selectIsland,
  calculateDivision,
  countOwnedIslands,
} from '../../src/games/remainder-islands/rules';
import {
  createInitialState,
  type RemainderIslandsState,
} from '../../src/games/remainder-islands/types';

function selecting(
  overrides: Partial<RemainderIslandsState> = {}
): RemainderIslandsState {
  const state = createInitialState();
  const island = state.islands[0];
  return {
    ...state,
    phase: 'selectIsland',
    currentRoll: { die1: 5, die2: 6, total: 11 },
    validIslands: [island.id],
    ...overrides,
    // keep islands unless overridden
    islands: overrides.islands ?? state.islands,
  };
}

describe('Wave 41 remainder — selectIsland score matrix', () => {
  it('scores remainder and claims island', () => {
    const state = selecting();
    const island = state.islands[0];
    const div = calculateDivision(11, island.value);
    const next = selectIsland(state, island.id);
    expect(next).not.toBe(state);
    expect(next.player1Score).toBe(div.remainder);
    expect(next.player1Chips).toBe(state.player1Chips - 1);
    expect(next.islands.find((i) => i.id === island.id)?.owner).toBe('player1');
    expect(next.islands.find((i) => i.id === island.id)?.chips).toBe(1);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.currentRoll).toBeNull();
    expect(countOwnedIslands(next)).toEqual({ player1: 1, player2: 0 });
  });

  it('zero remainder still claims without score bump', () => {
    const state = createInitialState();
    // Pick island value that divides 12 evenly
    const island = state.islands.find((i) => i.value === 4)!;
    const ready = {
      ...state,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 6, die2: 6, total: 12 },
      validIslands: [island.id],
    };
    const next = selectIsland(ready, island.id);
    expect(next.player1Score).toBe(0);
    expect(next.islands.find((i) => i.id === island.id)?.owner).toBe('player1');
  });

  it('turnsRemaining 1 → gameOver with score winner', () => {
    const state = selecting({
      turnsRemaining: 1,
      player1Score: 5,
      player2Score: 3,
    });
    const next = selectIsland(state, state.validIslands[0]);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.turnsRemaining).toBe(0);
  });

  it('tied scores on final turn → winner null (draw)', () => {
    const state = selecting({
      turnsRemaining: 1,
      player1Score: 0,
      player2Score: 0,
    });
    // Choose island that yields 0 remainder so scores stay tied
    const island = state.islands.find((i) => 11 % i.value === 0) ?? state.islands[0];
    const ready = {
      ...state,
      validIslands: [island.id],
      currentRoll: { die1: 5, die2: 6, total: 11 },
    };
    // If remainder non-zero, forge equal after by setting p2 score equal to remainder
    const rem = 11 % island.value;
    const forged = {
      ...ready,
      player2Score: rem,
      player1Score: 0,
    };
    const next = selectIsland(forged, island.id);
    expect(next.phase).toBe('gameOver');
    expect(next.player1Score).toBe(next.player2Score);
    expect(next.winner).toBeNull();
  });
});
