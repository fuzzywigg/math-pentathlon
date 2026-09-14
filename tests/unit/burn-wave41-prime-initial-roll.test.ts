/**
 * Wave 41 HEAVY — Prime Gold createInitialState + rollDice phase matrices.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  CONFIG,
  DICE_CONFIG,
  isPrime,
} from '../../src/games/prime-gold/types';
import {
  createInitialState,
  rollDice,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Prime Gold — createInitialState openings', () => {
  it('opens rolling with player1, null dice, and starting chips', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    expect(state.phase).toBe('rolling');
    expect(state.diceRoll).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.moveHistory).toEqual([]);
    expect(state.playerChips).toEqual({
      player1: CONFIG.STARTING_CHIPS,
      player2: CONFIG.STARTING_CHIPS,
    });
    expect(state.primeVeins).toEqual({ player1: 0, player2: 0 });
  });

  it('spiral board has 49 cells valued 1..49 with prime flags', () => {
    const state = createInitialState();
    expect(state.cells.size).toBe(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
    const values = [...state.cells.values()].map((c) => c.value).sort((a, b) => a - b);
    expect(values).toEqual(Array.from({ length: 49 }, (_, i) => i + 1));
    for (const cell of state.cells.values()) {
      expect(cell.owner).toBeNull();
      expect(cell.isPrime).toBe(isPrime(cell.value));
      const goldbachTarget = cell.value % 2 === 0 && cell.value > 2 && cell.value < 20;
      expect(cell.isGoldbachTarget).toBe(goldbachTarget);
    }
  });

  it('center spiral value 1 sits at board midpoint', () => {
    const state = createInitialState();
    const center = Math.floor(CONFIG.BOARD_SIZE / 2);
    const cell = findCellByValue(state, 1);
    expect(cell).toEqual(
      expect.objectContaining({ row: center, col: center, value: 1, owner: null })
    );
  });
});

describe('Wave 41 Prime Gold — rollDice phase matrix', () => {
  it.each([0, 0.49, 0.99] as const)(
    'random=%s yields faces within die ranges and enters placing',
    (r) => {
      vi.spyOn(Math, 'random').mockReturnValue(r);
      const next = rollDice(createInitialState());
      expect(next.phase).toBe('placing');
      expect(next.diceRoll).not.toBeNull();
      const { die1, die2, die3 } = next.diceRoll!;
      expect(die1).toBeGreaterThanOrEqual(DICE_CONFIG.die1.min);
      expect(die1).toBeLessThanOrEqual(DICE_CONFIG.die1.max);
      expect(die2).toBeGreaterThanOrEqual(DICE_CONFIG.die2.min);
      expect(die2).toBeLessThanOrEqual(DICE_CONFIG.die2.max);
      expect(die3).toBeGreaterThanOrEqual(DICE_CONFIG.die3.min);
      expect(die3).toBeLessThanOrEqual(DICE_CONFIG.die3.max);
    }
  );

  it('min random maps to all-ones; near-max maps to die maxima', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollDice(createInitialState()).diceRoll).toEqual({
      die1: 1,
      die2: 1,
      die3: 1,
    });
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const hi = rollDice(createInitialState()).diceRoll!;
    expect(hi.die1).toBe(DICE_CONFIG.die1.max);
    expect(hi.die2).toBe(DICE_CONFIG.die2.max);
    expect(hi.die3).toBe(DICE_CONFIG.die3.max);
  });

  it.each(['placing', 'gameOver'] as const)(
    'identity when phase is %s',
    (phase) => {
      const state = {
        ...createInitialState(),
        phase,
        diceRoll: { die1: 2, die2: 3, die3: 4 },
      };
      expect(rollDice(state)).toBe(state);
    }
  );

  it('preserves chips/veins/history when transitioning rolling→placing', () => {
    const base = createInitialState();
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const next = rollDice(base);
    expect(next.playerChips).toEqual(base.playerChips);
    expect(next.primeVeins).toEqual(base.primeVeins);
    expect(next.moveHistory).toEqual(base.moveHistory);
    expect(next.currentPlayer).toBe('player1');
    expect(next.cells).toBe(base.cells);
  });
});
