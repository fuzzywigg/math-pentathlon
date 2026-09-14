/**
 * Wave 35 — Remainder Islands empty valids + selection score-neutral.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  findValidIslands,
  setSelectedIsland,
  selectIsland,
  countOwnedIslands,
} from '../../src/games/remainder-islands/rules';
import { getAIIslandChoice, isAITurn } from '../../src/games/remainder-islands/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 35 Remainder Islands — empty valids', () => {
  it('all opponent-owned islands → findValidIslands empty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    let state = performRoll(createInitialState());
    for (const island of state.islands) {
      island.owner = 'player2';
    }
    expect(findValidIslands(state, state.currentRoll!.total)).toEqual([]);
  });

  it('AI null on gameOver / wrong seat / rolling phase', () => {
    const rolling = createInitialState();
    expect(getAIIslandChoice(rolling, 'player1', 'hard')).toBeNull();
    const over = { ...rolling, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(getAIIslandChoice(over, 'player1', 'hard')).toBeNull();
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const rolled = performRoll(createInitialState());
    expect(getAIIslandChoice(rolled, 'player2', 'hard')).toBeNull();
  });

  it('setSelectedIsland does not mutate island ownership or scores', () => {
    const state = createInitialState();
    const beforeOwners = state.islands.map((i) => i.owner);
    const beforeP1 = state.player1Score;
    const beforeP2 = state.player2Score;
    const id = state.islands[0].id;
    const next = setSelectedIsland(state, id);
    expect(next.islands.map((i) => i.owner)).toEqual(beforeOwners);
    expect(next.player1Score).toBe(beforeP1);
    expect(next.player2Score).toBe(beforeP2);
    expect(next.selectedIsland).toBe(id);
  });

  it('selectIsland identity for id not in valid set', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = performRoll(createInitialState());
    expect(selectIsland(state, 'no-such-island')).toBe(state);
  });

  it('countOwnedIslands starts at zeros; isAITurn gates', () => {
    expect(countOwnedIslands(createInitialState())).toEqual({
      player1: 0,
      player2: 0,
    });
    const state = createInitialState();
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(
      isAITurn({ ...state, phase: 'gameOver', winner: 'player1' }, 'player1')
    ).toBe(false);
  });
});
