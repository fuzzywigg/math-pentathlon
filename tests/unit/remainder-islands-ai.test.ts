import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import {
  getAIIslandChoice,
  executeAISelection,
  isAITurn,
} from '../../src/games/remainder-islands/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

/** Inject selectIsland without roll-retry loops. */
function selectIslandState(
  overrides: Partial<ReturnType<typeof createInitialState>> = {}
) {
  const base = createInitialState();
  return {
    ...base,
    phase: 'selectIsland' as const,
    currentRoll: { die1: 3, die2: 4, total: 7 },
    validIslands: base.islands.map((i) => i.id),
    ...overrides,
  };
}

describe('Remainder Islands AI', () => {
  it('isAITurn respects seat and game over', () => {
    const state = selectIslandState();
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn(state, 'player2')).toBe(false);
    expect(isAITurn({ ...state, phase: 'gameOver' }, 'player1')).toBe(false);
  });

  it('getAIIslandChoice returns null outside selectIsland / wrong seat / no roll', () => {
    const base = createInitialState();
    expect(getAIIslandChoice(base, 'player1', 'easy')).toBeNull();
    expect(
      getAIIslandChoice(selectIslandState({ currentPlayer: 'player2' }), 'player1', 'easy')
    ).toBeNull();
    expect(
      getAIIslandChoice(
        selectIslandState({ currentRoll: null }),
        'player1',
        'easy'
      )
    ).toBeNull();
  });

  it('getAIIslandChoice easy picks a valid island id', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = selectIslandState();
    const choice = getAIIslandChoice(state, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect(state.validIslands).toContain(choice!.islandId);
  });

  it('executeAISelection owns or scores an island and leaves selectIsland', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = selectIslandState();
    const next = executeAISelection(state, 'player1', 'easy');
    expect(next).not.toBe(state);
    expect(next.phase).not.toBe('selectIsland');
    expect(
      next.moveHistory.length > state.moveHistory.length ||
        next.currentPlayer !== state.currentPlayer ||
        next.islands.some((i) => i.owner === 'player1')
    ).toBe(true);
  });

  it('executeAISelection is a no-op when choice is unavailable', () => {
    const state = selectIslandState({ validIslands: [] });
    const next = executeAISelection(state, 'player1', 'easy');
    expect(next).toBe(state);
  });

  it('getAIIslandChoice hard still returns a listed island', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = selectIslandState();
    const choice = getAIIslandChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(state.validIslands).toContain(choice!.islandId);
  });
});
