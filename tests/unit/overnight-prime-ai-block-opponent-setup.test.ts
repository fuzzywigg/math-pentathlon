/**
 * Overnight HEAVY — Prime Gold hard still returns legal move when opponent owns diagonal primes.
 * Exercises block-opponent scoring path presence. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIPlacement } from '../../src/games/prime-gold/ai';
import {
  createInitialState,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';
import { CONFIG, type PrimeGoldState } from '../../src/games/prime-gold/types';

afterEach(() => vi.restoreAllMocks());

function forgeOpponentVein(): PrimeGoldState {
  let state = createInitialState();
  const cells = new Map(state.cells);
  const diagPrimes: { row: number; col: number }[] = [];
  for (let i = 0; i < CONFIG.BOARD_SIZE; i++) {
    const cell = cells.get(`${i},${i}`);
    if (cell?.isPrime) diagPrimes.push({ row: i, col: i });
  }
  for (const p of diagPrimes.slice(0, 2)) {
    const cell = cells.get(`${p.row},${p.col}`)!;
    cells.set(`${p.row},${p.col}`, { ...cell, owner: 'player2' });
  }
  return {
    ...state,
    cells,
    phase: 'placing',
    currentPlayer: 'player1',
    diceRoll: { die1: 2, die2: 3, die3: 4 },
  };
}

describe('Overnight prime — block opponent setup', () => {
  it('hard placement remains among valids with opponent vein seeds', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const placing = forgeOpponentVein();
    const valids = getValidPlacements(placing);
    expect(valids.length).toBeGreaterThan(0);
    const ans = getAIPlacement(placing, 'player1', 'hard');
    expect(ans).not.toBeNull();
    expect(valids.some((p) => p.value === ans!.value)).toBe(true);
    expect(findCellByValue(placing, ans!.value)!.owner).toBeNull();
  });
});
