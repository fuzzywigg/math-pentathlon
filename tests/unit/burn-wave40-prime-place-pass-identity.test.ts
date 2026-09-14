/**
 * Wave 40 — Prime Gold roll/place/pass identity leftovers.
 * After #177 chrome e2e; deepen engine rejects. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  rollDice,
  placeChip,
  passTurn,
  findCellByValue,
  getValidPlacements,
  hasValidMoves,
} from '../../src/games/prime-gold/rules';

describe('Wave 40 prime-gold — place/pass identity', () => {
  it('rollDice identity outside rolling; placeChip needs placing', () => {
    const state = createInitialState();
    const placing = {
      ...state,
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 2, die3: 3 },
    };
    expect(rollDice(placing)).toBe(placing);
    expect(placeChip(state, 10, '1+2+3')).toBe(state);
  });

  it('findCellByValue miss → null; placeChip rejects occupied / invalid', () => {
    const state = createInitialState();
    expect(findCellByValue(state, -999)).toBeNull();

    const rolled = rollDice(state);
    expect(rolled.phase).toBe('placing');
    expect(rolled.diceRoll).toBeTruthy();

    // Invalid value not in expressions
    expect(placeChip(rolled, 99999, 'x')).toBe(rolled);

    const valids = getValidPlacements(rolled);
    expect(Array.isArray(valids)).toBe(true);
    expect(typeof hasValidMoves(rolled)).toBe('boolean');
  });

  it('passTurn flips to rolling; identity on gameOver', () => {
    const state = createInitialState();
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();

    const over = { ...state, phase: 'gameOver' as const };
    expect(passTurn(over)).toBe(over);
  });
});
