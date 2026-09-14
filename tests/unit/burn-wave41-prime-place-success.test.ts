/**
 * Wave 41 HEAVY — Prime Gold placeChip success / settle branches.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, type PrimeGoldState } from '../../src/games/prime-gold/types';
import {
  createInitialState,
  getValidPlacements,
  placeChip,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

function placing(
  dice: { die1: number; die2: number; die3: number },
  overrides: Partial<PrimeGoldState> = {}
): PrimeGoldState {
  return {
    ...createInitialState(),
    diceRoll: dice,
    phase: 'placing',
    ...overrides,
  };
}

describe('Wave 41 Prime Gold — placeChip success paths', () => {
  it('claims cell for current player, records move, clears dice, flips seat', () => {
    const state = placing({ die1: 2, die2: 3, die3: 4 });
    const [pick] = getValidPlacements(state);
    expect(pick).toBeTruthy();
    const next = placeChip(state, pick.value, pick.expr);

    expect(findCellByValue(next, pick.value)?.owner).toBe('player1');
    expect(next.diceRoll).toBeNull();
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.playerChips.player1).toBe(CONFIG.STARTING_CHIPS - 1);
    expect(next.playerChips.player2).toBe(CONFIG.STARTING_CHIPS);
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0]).toMatchObject({
      player: 'player1',
      expression: pick.expr,
      result: pick.value,
      dice: { die1: 2, die2: 3, die3: 4 },
    });
  });

  it('player2 success flips back to player1', () => {
    const state = placing(
      { die1: 3, die2: 3, die3: 5 },
      { currentPlayer: 'player2' }
    );
    const [pick] = getValidPlacements(state);
    expect(pick).toBeTruthy();
    const next = placeChip(state, pick.value, pick.expr);
    expect(findCellByValue(next, pick.value)?.owner).toBe('player2');
    expect(next.currentPlayer).toBe('player1');
    expect(next.playerChips.player2).toBe(CONFIG.STARTING_CHIPS - 1);
  });

  it('exhausting last chips on both sides settles gameOver', () => {
    const state = placing(
      { die1: 2, die2: 3, die3: 4 },
      { playerChips: { player1: 1, player2: 0 } }
    );
    const [pick] = getValidPlacements(state);
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.phase).toBe('gameOver');
    expect(next.playerChips).toEqual({ player1: 0, player2: 0 });
    expect(next.diceRoll).toBeNull();
    expect(['player1', 'player2', null]).toContain(next.winner);
    if (next.winner) {
      expect(next.currentPlayer).toBe(next.winner);
    }
  });

  it('success leaves previously owned cells untouched', () => {
    let state = placing({ die1: 2, die2: 3, die3: 4 });
    const all = getValidPlacements(state);
    expect(all.length).toBeGreaterThan(1);
    const first = all[0];
    state = placeChip(state, first.value, first.expr);
    expect(findCellByValue(state, first.value)?.owner).toBe('player1');

    state = placing(
      { die1: 2, die2: 3, die3: 4 },
      {
        cells: state.cells,
        currentPlayer: 'player2',
        playerChips: state.playerChips,
        moveHistory: state.moveHistory,
        primeVeins: state.primeVeins,
      }
    );
    const second = getValidPlacements(state).find((p) => p.value !== first.value);
    expect(second).toBeTruthy();
    const next = placeChip(state, second!.value, second!.expr);
    expect(findCellByValue(next, first.value)?.owner).toBe('player1');
    expect(findCellByValue(next, second!.value)?.owner).toBe('player2');
    expect(next.moveHistory).toHaveLength(2);
  });

  it('primeVeins counters remain non-negative integers after placement', () => {
    const state = placing({ die1: 5, die2: 5, die3: 5 });
    const [pick] = getValidPlacements(state);
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.primeVeins.player1).toBeGreaterThanOrEqual(0);
    expect(next.primeVeins.player2).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(next.primeVeins.player1)).toBe(true);
  });
});
