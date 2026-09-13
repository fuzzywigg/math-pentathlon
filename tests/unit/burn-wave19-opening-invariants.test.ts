/**
 * Wave 19 — opening config / inventory invariants across existing games.
 * Distinct from wave 14 types-helpers and wave 18 pass/valid.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  DICE_CONFIG,
  CONFIG as PRIME_CFG,
} from '../../src/games/prime-gold/types';
import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';

import {
  ISLAND_VALUES,
  TOTAL_TURNS,
  INITIAL_CHIPS_PER_PLAYER,
  createInitialState as createRemainder,
} from '../../src/games/remainder-islands/types';

import {
  PLAYER_CHIPS,
  CONFIG as KWA_CFG,
  createChip,
} from '../../src/games/kwatro-sinko/types';
import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';

import {
  PIECES_PER_PLAYER,
  createInitialState as createPent,
  getPlayerPieces,
} from '../../src/games/pent-em-in/types';

import {
  DEFAULT_BOARD_SIZE,
  createInitialState as createHex,
} from '../../src/games/hex/types';

import {
  TOTAL_CUBES,
  INITIAL_CUBES_PER_PIT,
  PITS_PER_SIDE,
  createInitialState as createCalla,
} from '../../src/games/calla/types';

import {
  INITIAL_BANK,
  BLOCK_SIZES,
  BLOCK_COLORS,
  createInitialState as createHag,
} from '../../src/games/hex-a-gone/types';

import {
  getShapeById,
  DICE_TO_CATEGORY,
  ALL_SHAPES,
  getShapesForDie,
} from '../../src/games/juggle/types';

import { INITIAL_QUADRAPHAGE_COUNT } from '../../src/games/kings-quadraphages/pieces';
import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';

import { CONFIG as FIAR_CFG, createInitialState as createFiar } from '../../src/games/fiar/types';

import { CONFIG as SD_CFG, createDominoSet } from '../../src/games/sum-dominoes/types';

describe('Wave 19 invariants — Prime Gold dice / board', () => {
  it('DICE_CONFIG ranges match die1–3 mins/maxes', () => {
    expect(DICE_CONFIG.die1).toEqual({ min: 1, max: 6 });
    expect(DICE_CONFIG.die2).toEqual({ min: 1, max: 8 });
    expect(DICE_CONFIG.die3).toEqual({ min: 1, max: 10 });
    const state = createPrime();
    expect(state.playerChips.player1).toBe(PRIME_CFG.STARTING_CHIPS);
    expect(state.playerChips.player2).toBe(PRIME_CFG.STARTING_CHIPS);
    expect(state.cells.size).toBeGreaterThan(20);
    expect(state.phase).toBe('rolling');
  });
});

describe('Wave 19 invariants — Remainder Islands', () => {
  it('ISLAND_VALUES / TOTAL_TURNS / chip inventory match opening', () => {
    expect(ISLAND_VALUES).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    expect(TOTAL_TURNS).toBe(24);
    const state = createRemainder();
    expect(state.player1Chips).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(state.player2Chips).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(state.turnsRemaining).toBe(TOTAL_TURNS);
    expect(state.islands.length).toBeGreaterThan(ISLAND_VALUES.length);
    for (const island of state.islands) {
      expect(ISLAND_VALUES).toContain(island.value);
    }
  });
});

describe('Wave 19 invariants — Kwatro chip parity', () => {
  it('PLAYER_CHIPS even/odd sets match CONFIG count and opening hand', () => {
    expect(PLAYER_CHIPS.player1).toEqual([0, 2, 4, 6, 8]);
    expect(PLAYER_CHIPS.player2).toEqual([1, 3, 5, 7, 9]);
    expect(PLAYER_CHIPS.player1).toHaveLength(KWA_CFG.CHIPS_PER_PLAYER);
    expect(PLAYER_CHIPS.player2).toHaveLength(KWA_CFG.CHIPS_PER_PLAYER);

    const state = createKwa();
    const all = [...state.chips.values()];
    const p1 = all.filter((c) => c.owner === 'player1');
    const p2 = all.filter((c) => c.owner === 'player2');
    expect(p1.map((c) => c.value).sort((a, b) => a - b)).toEqual(
      [...PLAYER_CHIPS.player1]
    );
    expect(p2.map((c) => c.value).sort((a, b) => a - b)).toEqual(
      [...PLAYER_CHIPS.player2]
    );

    const chip = createChip('t', 4, 'player1');
    expect(chip.position).toBeNull();
    expect(chip.value).toBe(4);
  });
});

describe('Wave 19 invariants — Pent / Hex / Calla sizes', () => {
  it('PIECES_PER_PLAYER matches available lists for both seats', () => {
    const state = createPent();
    const p1 = getPlayerPieces(state, 'player1');
    const p2 = getPlayerPieces(state, 'player2');
    expect(p1.available).toHaveLength(PIECES_PER_PLAYER);
    expect(p2.available).toHaveLength(PIECES_PER_PLAYER);
    expect(p1.available).toEqual(p2.available);
  });

  it('DEFAULT_BOARD_SIZE drives hex opening board', () => {
    expect(DEFAULT_BOARD_SIZE).toBe(11);
    const state = createHex();
    expect(state.boardSize).toBe(DEFAULT_BOARD_SIZE);
    expect(state.board).toHaveLength(DEFAULT_BOARD_SIZE);
    expect(state.board[0]).toHaveLength(DEFAULT_BOARD_SIZE);
  });

  it('TOTAL_CUBES matches pits × cubes opening', () => {
    expect(TOTAL_CUBES).toBe(PITS_PER_SIDE * 2 * INITIAL_CUBES_PER_PIT);
    const state = createCalla();
    const sum =
      state.player1Pits.reduce((a, b) => a + b, 0) +
      state.player2Pits.reduce((a, b) => a + b, 0) +
      state.player1Calla +
      state.player2Calla;
    expect(sum).toBe(TOTAL_CUBES);
  });
});

describe('Wave 19 invariants — Hex-a-Gone bank / colors', () => {
  it('INITIAL_BANK and BLOCK_* tables are consistent with opening', () => {
    const state = createHag();
    for (const shape of Object.keys(INITIAL_BANK) as (keyof typeof INITIAL_BANK)[]) {
      expect(state.bank[shape]).toBe(INITIAL_BANK[shape]);
      expect(BLOCK_SIZES[shape]).toBeGreaterThan(0);
      expect(BLOCK_COLORS[shape]).toMatch(/^#/);
    }
    const bankTotal = Object.values(INITIAL_BANK).reduce((a, b) => a + b, 0);
    expect(bankTotal).toBe(3 + 6 + 6 + 12 + 6);
  });
});

describe('Wave 19 invariants — Juggle shape lookup', () => {
  it('getShapeById hits every ALL_SHAPES id and misses junk', () => {
    expect(ALL_SHAPES.length).toBeGreaterThan(10);
    for (const shape of ALL_SHAPES) {
      expect(getShapeById(shape.id)).toBe(shape);
    }
    expect(getShapeById('')).toBeUndefined();
    expect(getShapeById('not-a-shape')).toBeUndefined();

    for (let die = 1; die <= 6; die++) {
      expect(DICE_TO_CATEGORY[die]).toBeTruthy();
      expect(getShapesForDie(die).length).toBeGreaterThan(0);
    }
  });
});

describe('Wave 19 invariants — Kings / FIAR / Sum Dominoes opening', () => {
  it('Kings supplies equal INITIAL_QUADRAPHAGE_COUNT', () => {
    const state = createKings();
    expect(state.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(state.player2Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(INITIAL_QUADRAPHAGE_COUNT).toBe(30);
  });

  it('FIAR chips-per-player and Sum Dominoes set sizes', () => {
    const fiar = createFiar();
    expect(FIAR_CFG.CHIPS_PER_PLAYER).toBe(4);
    expect(fiar.chipsPlaced.player1).toBe(0);
    expect(fiar.chipsPlaced.player2).toBe(0);

    const set = createDominoSet();
    // Double-six set: 28 tiles; each seat starts with STARTING_HAND_SIZE
    expect(set.length).toBe(28);
    expect(SD_CFG.STARTING_HAND_SIZE).toBe(7);
    expect(SD_CFG.BOARD_SIZE).toBe(11);
  });
});
