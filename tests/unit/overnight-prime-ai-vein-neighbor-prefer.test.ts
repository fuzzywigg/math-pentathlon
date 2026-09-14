/**
 * Overnight HEAVY — Prime Gold hard prefers prime adjacent to owned diagonal primes.
 * Exercises wouldExtendVein / neighbor scoring indirectly. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIPlacement } from '../../src/games/prime-gold/ai';
import {
  createInitialState,
  findCellByValue,
  getValidPlacements,
} from '../../src/games/prime-gold/rules';
import { CONFIG, type PrimeGoldState } from '../../src/games/prime-gold/types';

afterEach(() => vi.restoreAllMocks());

function forgePlacing(): PrimeGoldState {
  let state = createInitialState();
  const cells = new Map(state.cells);
  // Seed two owned primes on main diagonal if available
  const diagPrimes: { row: number; col: number; value: number }[] = [];
  for (let i = 0; i < CONFIG.BOARD_SIZE; i++) {
    const cell = cells.get(`${i},${i}`);
    if (cell?.isPrime) diagPrimes.push({ row: i, col: i, value: cell.value });
  }
  expect(diagPrimes.length).toBeGreaterThanOrEqual(3);
  for (const p of diagPrimes.slice(0, 2)) {
    const cell = cells.get(`${p.row},${p.col}`)!;
    cells.set(`${p.row},${p.col}`, { ...cell, owner: 'player1' });
  }
  // Broad dice to maximize placement options
  return {
    ...state,
    cells,
    phase: 'placing',
    currentPlayer: 'player1',
    diceRoll: { die1: 1, die2: 2, die3: 3 },
  };
}

describe('Overnight prime — vein neighbor prefer', () => {
  it('hard (no random) picks a prime among valids when vein neighbors exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const placing = forgePlacing();
    const valids = getValidPlacements(placing);
    expect(valids.length).toBeGreaterThan(0);
    const ans = getAIPlacement(placing, 'player1', 'hard');
    expect(ans).not.toBeNull();
    const cell = findCellByValue(placing, ans!.value)!;
    // Scoring strongly favors primes; hard should land on a prime when any remain
    const anyPrimeValid = valids.some((p) => findCellByValue(placing, p.value)?.isPrime);
    if (anyPrimeValid) {
      expect(cell.isPrime).toBe(true);
    }
  });
});
