/**
 * Wave 35 — Prime Gold empty valids + pass clears dice + AI null mid-place.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  rollDice,
  getValidPlacements,
  hasValidMoves,
  passTurn,
  findCellByValue,
  placeChip,
} from '../../src/games/prime-gold/rules';
import { getAIPlacement, isAITurn } from '../../src/games/prime-gold/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 35 Prime Gold — empty valids / pass', () => {
  it('owned collision empties placements and nulls AI placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = rollDice(createInitialState());
    expect(state.phase).toBe('placing');
    expect(state.diceRoll).not.toBeNull();
    const placements = getValidPlacements(state);
    // Claim every currently valid target as owned by opponent
    for (const p of placements) {
      const cell = findCellByValue(state, p.value);
      if (cell) cell.owner = 'player2';
    }
    expect(getValidPlacements(state)).toEqual([]);
    expect(hasValidMoves(state)).toBe(false);
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();
  });

  it('passTurn from placing clears dice and flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = rollDice(createInitialState());
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.diceRoll).toBeNull();
    expect(next.phase).toBe('rolling');
  });

  it('passTurn identity on gameOver', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(passTurn(state)).toBe(state);
  });

  it('placeChip identity for already-owned value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = rollDice(createInitialState());
    const first = getValidPlacements(state)[0];
    if (!first) return;
    const cell = findCellByValue(state, first.value)!;
    cell.owner = 'player2';
    expect(placeChip(state, first.value, first.expr)).toBe(state);
  });

  it('isAITurn false for hvh', () => {
    expect(isAITurn(createInitialState(), 'player1', 'human-vs-human')).toBe(false);
  });
});
