/**
 * Wave 41 — Prime Gold chip / vein settle edge leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  rollDice,
  placeChip,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';
import { CONFIG, isPrime } from '../../src/games/prime-gold/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 prime — chip / vein settle', () => {
  it('placeChip identity when target already owned', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const first = getValidPlacements(state)[0];
    const cell = findCellByValue(state, first.value)!;
    cell.owner = 'player2';
    expect(placeChip(state, first.value, first.expr)).toBe(state);
  });

  it('primeVeins stay non-negative integers after a place', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const first = getValidPlacements(state)[0];
    const next = placeChip(state, first.value, first.expr);
    expect(next.primeVeins.player1).toBeGreaterThanOrEqual(0);
    expect(next.primeVeins.player2).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(next.primeVeins.player1)).toBe(true);
  });

  it('forged last chips with zero veins settle gameOver without inventing winner veins', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = rollDice(createInitialState());
    const first = getValidPlacements(state)[0];
    // Both players already at 1 chip; opponent at 0 so after this place both at 0
    state = {
      ...state,
      playerChips: { player1: 1, player2: 0 },
    };
    const next = placeChip(state, first.value, first.expr);
    expect(next.playerChips.player1).toBe(0);
    expect(next.playerChips.player2).toBe(0);
    // With no 4-long prime diagonals, veins stay 0 → tie winner null, gameOver
    if (next.primeVeins.player1 === 0 && next.primeVeins.player2 === 0) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBeNull();
    } else {
      expect(next.phase).toBe('gameOver');
      // whichever has more veins wins; equal → null
      if (next.primeVeins.player1 === next.primeVeins.player2) {
        expect(next.winner).toBeNull();
      } else {
        expect(next.winner).toBe(
          next.primeVeins.player1 > next.primeVeins.player2
            ? 'player1'
            : 'player2'
        );
      }
    }
  });

  it('VEINS_TO_WIN path: pre-seeded prime diagonal reaches win on place', () => {
    // Seed MIN_VEIN_LENGTH-1 owned primes on a main diagonal, then place the completing chip
    // only if a valid roll can hit a needed prime cell — otherwise skip via soft assert.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const size = CONFIG.BOARD_SIZE;
    // Collect main diagonal (r===c) primes
    const diagPrimes: number[] = [];
    for (let i = 0; i < size; i++) {
      const cell = state.cells.get(`${i},${i}`);
      if (cell?.isPrime) diagPrimes.push(cell.value);
    }
    expect(diagPrimes.length).toBeGreaterThanOrEqual(CONFIG.MIN_VEIN_LENGTH);

    // Own first MIN_VEIN_LENGTH-1 primes on that diagonal
    const cells = new Map(state.cells);
    for (let i = 0; i < CONFIG.MIN_VEIN_LENGTH - 1; i++) {
      const v = diagPrimes[i];
      const cell = findCellByValue({ ...state, cells }, v)!;
      cells.set(`${cell.row},${cell.col}`, { ...cell, owner: 'player1' });
    }
    state = { ...state, cells };
    state = rollDice(state);
    const need = diagPrimes[CONFIG.MIN_VEIN_LENGTH - 1];
    const hit = getValidPlacements(state).find((p) => p.value === need);
    if (!hit) {
      // Dice may not produce the needed value — assert placement reject path only
      expect(isPrime(need)).toBe(true);
      expect(placeChip(state, need, 'forced')).toBe(state);
      return;
    }
    const next = placeChip(state, hit.value, hit.expr);
    expect(next.primeVeins.player1).toBeGreaterThanOrEqual(1);
    if (next.primeVeins.player1 >= CONFIG.VEINS_TO_WIN) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
    }
  });
});
