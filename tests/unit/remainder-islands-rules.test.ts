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

function selectingState(
  overrides: Partial<RemainderIslandsState> = {}
): RemainderIslandsState {
  const base = createInitialState();
  const roll = { die1: 5, die2: 4, total: 9 };
  const validIslands = findValidIslands(base, roll.total);
  return {
    ...base,
    currentRoll: roll,
    validIslands,
    phase: 'selectIsland',
    ...overrides,
  };
}

describe('Remainder Islands – division math', () => {
  it('calculateDivision returns quotient and remainder', () => {
    expect(calculateDivision(11, 3)).toEqual({
      dividend: 11,
      divisor: 3,
      quotient: 3,
      remainder: 2,
    });
    expect(calculateDivision(9, 4).remainder).toBe(1);
  });

  it('previewDivision mirrors calculateDivision for a selected island', () => {
    const state = selectingState();
    const islandId = state.validIslands[0];
    const preview = previewDivision(state, islandId);
    expect(preview).not.toBeNull();
    expect(preview!.dividend).toBe(9);
    expect(preview!.remainder).toBe(
      calculateDivision(9, preview!.divisor).remainder
    );
  });
});

describe('Remainder Islands – islands and scoring', () => {
  it('findValidIslands excludes opponent-owned islands', () => {
    const state = createInitialState();
    const target = state.islands[0];
    const blocked: RemainderIslandsState = {
      ...state,
      islands: state.islands.map((i) =>
        i.id === target.id ? { ...i, owner: 'player2' } : i
      ),
    };
    const valid = findValidIslands(blocked, 9);
    expect(valid).not.toContain(target.id);
    expect(valid.length).toBe(state.islands.length - 1);
  });

  it('selectIsland awards remainder points and flips the player', () => {
    const state = selectingState();
    const islandId = state.validIslands[0];
    const island = state.islands.find((i) => i.id === islandId)!;
    const expectedPoints = 9 % island.value;

    const next = selectIsland(state, islandId);
    expect(next.player1Score).toBe(expectedPoints);
    expect(next.player1Chips).toBe(state.player1Chips - 1);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.islands.find((i) => i.id === islandId)?.owner).toBe('player1');
  });

  it('rejects islands not in the valid set', () => {
    const state = selectingState({ validIslands: [] });
    expect(selectIsland(state, state.islands[0].id)).toBe(state);
  });

  it('ends the game when turnsRemaining hits zero', () => {
    const state = selectingState({ turnsRemaining: 1 });
    const next = selectIsland(state, state.validIslands[0]);
    expect(next.phase).toBe('gameOver');
    expect(next.turnsRemaining).toBe(0);
  });

  it('performRoll uses dice and may skip when no islands remain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // die faces = 1
    const next = performRoll(createInitialState());
    expect(next.currentRoll).toEqual({ die1: 1, die2: 1, total: 2 });
    expect(['selectIsland', 'rolling']).toContain(next.phase);
    if (next.phase === 'selectIsland') {
      expect(next.validIslands.length).toBeGreaterThan(0);
    }
  });
});
