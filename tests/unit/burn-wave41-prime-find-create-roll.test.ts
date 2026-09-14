/**
 * Wave 41 — Prime Gold findCellByValue / createInitialState / rollDice leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  findCellByValue,
  rollDice,
} from '../../src/games/prime-gold/rules';
import { CONFIG, DICE_CONFIG } from '../../src/games/prime-gold/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 prime — find / create / roll', () => {
  it('findCellByValue miss returns null; hits return matching cell', () => {
    const state = createInitialState();
    expect(findCellByValue(state, 0)).toBeNull();
    expect(findCellByValue(state, -1)).toBeNull();
    expect(findCellByValue(state, 999)).toBeNull();
    const cell = findCellByValue(state, 1);
    expect(cell).toBeTruthy();
    expect(cell!.value).toBe(1);
    expect(findCellByValue(state, CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE)?.value).toBe(
      CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE
    );
  });

  it('createInitialState opens rolling with chips and empty veins', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    expect(state.diceRoll).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.currentPlayer).toBe('player1');
    expect(state.playerChips.player1).toBe(CONFIG.STARTING_CHIPS);
    expect(state.playerChips.player2).toBe(CONFIG.STARTING_CHIPS);
    expect(state.primeVeins).toEqual({ player1: 0, player2: 0 });
    expect(state.cells.size).toBe(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
  });

  it('rollDice identity when phase is not rolling', () => {
    const state = createInitialState();
    const placing = { ...state, phase: 'placing' as const };
    expect(rollDice(placing)).toBe(placing);
    const over = { ...state, phase: 'gameOver' as const, winner: 'player1' as const };
    expect(rollDice(over)).toBe(over);
  });

  it('rollDice advances to placing with dice in configured ranges', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = rollDice(createInitialState());
    expect(next.phase).toBe('placing');
    expect(next.diceRoll).toEqual({
      die1: DICE_CONFIG.die1.min,
      die2: DICE_CONFIG.die2.min,
      die3: DICE_CONFIG.die3.min,
    });
  });
});
