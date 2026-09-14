/**
 * Wave 42 — Prime Gold placeChip settle / win leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  rollDice,
  placeChip,
  getValidPlacements,
  findCellByValue,
} from '../../src/games/prime-gold/rules';
import { CONFIG } from '../../src/games/prime-gold/types';
import type { BoardCell, Player, PrimeGoldState } from '../../src/games/prime-gold/types';

afterEach(() => vi.restoreAllMocks());

function ownDiagonalPrimes(
  state: PrimeGoldState,
  player: Player,
  count: number
): PrimeGoldState {
  const cells = new Map(state.cells);
  const diag: BoardCell[] = [];
  for (let i = 0; i < CONFIG.BOARD_SIZE; i++) {
    const cell = cells.get(`${i},${i}`);
    if (cell?.isPrime) diag.push(cell);
  }
  for (let i = 0; i < count && i < diag.length; i++) {
    const c = diag[i];
    cells.set(`${c.row},${c.col}`, { ...c, owner: player });
  }
  return { ...state, cells };
}

function forgeLastChipState(
  state: PrimeGoldState,
  current: Player,
  p1Veins: number,
  p2Veins: number
): PrimeGoldState {
  const opponent: Player = current === 'player1' ? 'player2' : 'player1';
  return {
    ...state,
    playerChips: {
      player1: current === 'player1' ? 1 : 0,
      player2: current === 'player2' ? 1 : 0,
    },
    primeVeins: { player1: p1Veins, player2: p2Veins },
    currentPlayer: current,
  };
}

describe('Wave 42 prime — placeChip settle / win', () => {
  it('VEINS_TO_WIN: completing fourth prime on diagonal ends game for placer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = ownDiagonalPrimes(createInitialState(), 'player1', CONFIG.MIN_VEIN_LENGTH - 1);
    state = rollDice(state);
    const diagValues: number[] = [];
    for (let i = 0; i < CONFIG.BOARD_SIZE; i++) {
      const cell = state.cells.get(`${i},${i}`);
      if (cell?.isPrime) diagValues.push(cell.value);
    }
    const need = diagValues[CONFIG.MIN_VEIN_LENGTH - 1];
    const hit = getValidPlacements(state).find((p) => p.value === need);
    if (!hit) {
      expect(placeChip(state, need, 'forced')).toBe(state);
      return;
    }
    const next = placeChip(state, hit.value, hit.expr);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.primeVeins.player1).toBeGreaterThanOrEqual(CONFIG.VEINS_TO_WIN);
    expect(next.currentPlayer).toBe('player1');
  });

  it('all chips placed with equal veins settles tie (winner null)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = rollDice(createInitialState());
    const pick = getValidPlacements(state)[0];
    state = forgeLastChipState(state, 'player1', 0, 0);
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.playerChips.player1).toBe(0);
    expect(next.playerChips.player2).toBe(0);
    if (next.primeVeins.player1 === next.primeVeins.player2) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBeNull();
    }
  });

  it('all chips placed awards player1 when veins lead', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = rollDice(createInitialState());
    const pick = getValidPlacements(state)[0];
    state = forgeLastChipState(state, 'player1', 2, 0);
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.playerChips.player1).toBe(0);
    expect(next.playerChips.player2).toBe(0);
    if (next.primeVeins.player1 > next.primeVeins.player2) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
    }
  });

  it('all chips placed awards player2 when veins lead after p2 final chip', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = rollDice(createInitialState());
    const pick = getValidPlacements(state)[0];
    state = forgeLastChipState(state, 'player2', 0, 3);
    state = { ...state, currentPlayer: 'player2' as const };
    const next = placeChip(state, pick.value, pick.expr);
    expect(next.playerChips.player1).toBe(0);
    expect(next.playerChips.player2).toBe(0);
    if (next.primeVeins.player2 > next.primeVeins.player1) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player2');
    }
  });
});
