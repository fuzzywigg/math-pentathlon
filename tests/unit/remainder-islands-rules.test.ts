import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  RemainderIslandsState,
} from '../../src/games/remainder-islands/types';
import {
  calculateDivision,
  findValidIslands,
  selectIsland,
  performRoll,
  previewDivision,
} from '../../src/games/remainder-islands/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function withSelectPhase(
  overrides: Partial<RemainderIslandsState> = {}
): RemainderIslandsState {
  const base = createInitialState();
  const roll = { die1: 4, die2: 5, total: 9 };
  const validIslands = findValidIslands(base, roll.total);

  return {
    ...base,
    phase: 'selectIsland',
    currentRoll: roll,
    validIslands,
    ...overrides,
  };
}

describe('Remainder Islands – division', () => {
  it('calculateDivision(11, 3) yields quotient 3 and remainder 2', () => {
    expect(calculateDivision(11, 3)).toEqual({
      dividend: 11,
      divisor: 3,
      quotient: 3,
      remainder: 2,
    });
  });
});

describe('Remainder Islands – island selection', () => {
  it('selectIsland awards remainder points for roll total 9', () => {
    const state = withSelectPhase();
    expect(state.validIslands.length).toBeGreaterThan(0);

    const islandId = state.validIslands[0];
    const island = state.islands.find((i) => i.id === islandId)!;
    const expectedRemainder = 9 % island.value;

    const preview = previewDivision(state, islandId);
    expect(preview?.remainder).toBe(expectedRemainder);

    const next = selectIsland(state, islandId);

    expect(next.player1Score).toBe(expectedRemainder);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].pointsEarned).toBe(expectedRemainder);
    expect(next.islands.find((i) => i.id === islandId)?.owner).toBe('player1');
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
  });

  it('opponent-owned island is not in findValidIslands', () => {
    let state = createInitialState();
    const target = state.islands[0];
    state = {
      ...state,
      islands: state.islands.map((i) =>
        i.id === target.id ? { ...i, owner: 'player2' as const } : i
      ),
    };

    const valid = findValidIslands(state, 9);
    expect(valid).not.toContain(target.id);
  });

  it('turnsRemaining 1 then select → gameOver', () => {
    const state = withSelectPhase({ turnsRemaining: 1 });
    const islandId = state.validIslands[0];
    const next = selectIsland(state, islandId);

    expect(next.turnsRemaining).toBe(0);
    expect(next.phase).toBe('gameOver');
  });

  it('performRoll transitions to selectIsland when islands exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // die = 4
    const state = createInitialState();
    const next = performRoll(state);

    expect(next.currentRoll).not.toBeNull();
    expect(next.currentRoll!.die1).toBe(4);
    expect(next.currentRoll!.die2).toBe(4);
    expect(next.currentRoll!.total).toBe(8);
    expect(next.phase).toBe('selectIsland');
    expect(next.validIslands.length).toBeGreaterThan(0);
  });
});
