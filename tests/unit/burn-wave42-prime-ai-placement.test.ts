/**
 * Wave 42 — Prime Gold getAIPlacement leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { getAIPlacement } from '../../src/games/prime-gold/ai';
import {
  createInitialState,
  rollDice,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 prime — getAIPlacement', () => {
  it('returns null when wrong phase or wrong seat', () => {
    const rolling = createInitialState();
    expect(getAIPlacement(rolling, 'player1')).toBeNull();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const placing = rollDice(createInitialState());
    expect(getAIPlacement(placing, 'player2')).toBeNull();
  });

  it('returns null when no valid placements (must pass)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const placing = rollDice(createInitialState());
    for (const p of getValidPlacements(placing)) {
      findCellByValue(placing, p.value)!.owner = 'player2';
    }
    expect(getValidPlacements(placing)).toEqual([]);
    expect(getAIPlacement(placing, 'player1')).toBeNull();
  });

  it('medium difficulty picks a valid placement when randomness skipped', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1); // never take random branch
    const placing = rollDice(createInitialState());
    const result = getAIPlacement(placing, 'player1', 'medium');
    expect(result).not.toBeNull();
    const valids = getValidPlacements(placing);
    expect(valids.some((p) => p.value === result!.value)).toBe(true);
    expect(typeof result!.expression).toBe('string');
  });

  it('easy and hard difficulties return valid moves with seeded random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const placing = rollDice(createInitialState());
    for (const difficulty of ['easy', 'hard'] as const) {
      const result = getAIPlacement(placing, 'player1', difficulty);
      expect(result).not.toBeNull();
      expect(getValidPlacements(placing).some((p) => p.value === result!.value)).toBe(true);
    }
  });

  it('random branch can pick from top moves when randomness triggers', () => {
    let call = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      call++;
      return call === 1 ? 0 : 0.5;
    });
    const placing = rollDice(createInitialState());
    const result = getAIPlacement(placing, 'player1', 'hard');
    expect(result).not.toBeNull();
    expect(getValidPlacements(placing).some((p) => p.value === result!.value)).toBe(true);
  });
});
