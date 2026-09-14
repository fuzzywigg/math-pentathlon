/**
 * Wave 41 — Prime Gold placeChip / passTurn leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  rollDice,
  placeChip,
  passTurn,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 prime — place / pass', () => {
  it('placeChip identity when not placing or missing dice', () => {
    const state = createInitialState();
    expect(placeChip(state, 1, '1')).toBe(state);
    const placingNoDice = {
      ...state,
      phase: 'placing' as const,
      diceRoll: null,
    };
    expect(placeChip(placingNoDice, 1, '1')).toBe(placingNoDice);
  });

  it('placeChip identity for missing value or invalid expression target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    expect(placeChip(state, 999, 'ghost')).toBe(state);
    // Value on board but not reachable from dice expressions
    const valids = new Set(getValidPlacements(state).map((p) => p.value));
    let unreachable = 1;
    for (let v = 1; v <= 49; v++) {
      if (!valids.has(v) && findCellByValue(state, v)?.owner === null) {
        unreachable = v;
        break;
      }
    }
    if (!valids.has(unreachable)) {
      expect(placeChip(state, unreachable, 'x')).toBe(state);
    }
  });

  it('placeChip success claims cell, decrements chips, flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const first = getValidPlacements(state)[0];
    expect(first).toBeTruthy();
    const next = placeChip(state, first.value, first.expr);
    expect(next).not.toBe(state);
    expect(findCellByValue(next, first.value)?.owner).toBe('player1');
    expect(next.playerChips.player1).toBe(state.playerChips.player1 - 1);
    expect(next.diceRoll).toBeNull();
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
  });

  it('passTurn clears dice and flips; identity on gameOver', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const placing = rollDice(createInitialState());
    const next = passTurn(placing);
    expect(next.currentPlayer).toBe('player2');
    expect(next.diceRoll).toBeNull();
    expect(next.phase).toBe('rolling');

    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(passTurn(over)).toBe(over);
  });
});
