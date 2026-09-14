/**
 * Wave 42 leftovers B — Remainder Islands AI choice / execute / isAITurn.
 * Beyond wave41 select score matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getAIIslandChoice,
  executeAISelection,
  isAITurn,
} from '../../src/games/remainder-islands/ai';
import {
  createInitialState,
  type RemainderIslandsState,
} from '../../src/games/remainder-islands/types';

function selecting(
  overrides: Partial<RemainderIslandsState> = {}
): RemainderIslandsState {
  const state = createInitialState();
  const ids = state.islands.slice(0, 4).map((i) => i.id);
  return {
    ...state,
    phase: 'selectIsland',
    currentRoll: { die1: 4, die2: 5, total: 9 },
    validIslands: ids,
    ...overrides,
    islands: overrides.islands ?? state.islands,
  };
}

describe('Wave 42 remainder — AI island choice', () => {
  it('null when wrong phase / wrong seat / no roll', () => {
    const ready = selecting();
    expect(getAIIslandChoice(ready, 'player2', 'hard')).toBeNull();
    expect(
      getAIIslandChoice(
        { ...ready, phase: 'rolling', currentRoll: null, validIslands: [] },
        'player1',
        'easy'
      )
    ).toBeNull();
    expect(
      getAIIslandChoice({ ...ready, currentRoll: null }, 'player1', 'medium')
    ).toBeNull();
  });

  it('easy/medium/hard return a validIslands member', () => {
    const ready = selecting();
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      const choice = getAIIslandChoice(ready, 'player1', diff);
      expect(choice).not.toBeNull();
      expect(ready.validIslands).toContain(choice!.islandId);
    }
  });

  it('executeAISelection no-op identity when choice null; else updates', () => {
    const rolling = createInitialState();
    expect(executeAISelection(rolling, 'player1', 'hard')).toBe(rolling);

    const ready = selecting();
    const next = executeAISelection(ready, 'player1', 'hard');
    expect(next).not.toBe(ready);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.currentRoll).toBeNull();
  });

  it('isAITurn false on gameOver / null AI', () => {
    const ready = selecting();
    expect(isAITurn(ready, null)).toBe(false);
    expect(isAITurn(ready, 'player1')).toBe(true);
    expect(isAITurn(ready, 'player2')).toBe(false);
    expect(
      isAITurn({ ...ready, phase: 'gameOver', winner: 'player1' }, 'player1')
    ).toBe(false);
  });
});
