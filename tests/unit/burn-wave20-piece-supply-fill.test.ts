/**
 * Wave 20 — piece / supply / board-fill / position inventory after legal success.
 * Distinct from wave 18 geometry transforms and wave 19 serialization/lookup.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createPent,
  getPlayerPieces,
} from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  placePiece,
  getValidPlacements as pentPlacements,
  getPieceCells,
} from '../../src/games/pent-em-in/rules';

import {
  createInitialGameState,
  selectKing,
  placeQuadraphage,
  getSupply,
} from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';
import { INITIAL_QUADRAPHAGE_COUNT } from '../../src/games/kings-quadraphages/pieces';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  placeShape,
  getBoardFillPercentage,
  isPlacementValid,
} from '../../src/games/juggle/rules';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  getValidPlacements as primePlacements,
  placeChip as placePrime,
} from '../../src/games/prime-gold/rules';

import {
  createInitialState as createContig,
  getValidPlacements as contigPlacements,
} from '../../src/games/contig-60/types';
import { placeChip as placeContig } from '../../src/games/contig-60/rules';

import {
  createInitialState as createKwa,
  selectChip,
  moveChip,
  getValidMoves as kwaMoves,
} from '../../src/games/kwatro-sinko/rules';

import {
  createInitialState as createCalla,
  getPlayerPits,
  getPlayerCalla,
  getSideTotalCubes,
} from '../../src/games/calla/types';
import {
  getValidPits,
  makeMove as callaMove,
} from '../../src/games/calla/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 20 piece-supply — Pent-em-In available→placed', () => {
  it('placePiece moves shapeId from available to placed', () => {
    let state = createPent();
    const pieces = getPlayerPieces(state, 'player1');
    expect(pieces.available.length).toBeGreaterThan(0);
    const shapeId = pieces.available[0];
    state = selectPiece(state, shapeId);
    const placements = pentPlacements(state, shapeId, 0, false);
    expect(placements.length).toBeGreaterThan(0);
    const pos = placements[0];
    expect(getPieceCells(shapeId, pos, 0, false).length).toBeGreaterThan(0);

    const beforeAvail = getPlayerPieces(state, 'player1').available.length;
    const beforePlaced = getPlayerPieces(state, 'player1').placed.length;
    state = placePiece(state, shapeId, pos, 0, false);

    const after = getPlayerPieces(state, 'player1');
    expect(after.available.includes(shapeId)).toBe(false);
    expect(after.placed.includes(shapeId)).toBe(true);
    expect(after.available.length).toBe(beforeAvail - 1);
    expect(after.placed.length).toBe(beforePlaced + 1);
    expect(state.placedPieces.length).toBe(1);
  });
});

describe('Wave 20 piece-supply — Kings Quadraphages supply ledger', () => {
  it('opening supply is INITIAL_QUADRAPHAGE_COUNT; place drops by 1', () => {
    let state = createInitialGameState();
    expect(getSupply(state, 'player1')).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(getSupply(state, 'player2')).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(getSupply(state, 'player1')).toBeGreaterThan(0);

    state = selectKing(state);
    state = handleCellClick(2, 5, state).state;
    expect(state.turnPhase).toBe('placeQuadraphage');

    const before = getSupply(state, 'player1');
    state = placeQuadraphage(state, { row: 1, col: 4 });
    expect(getSupply(state, 'player1')).toBe(before - 1);
  });

  it('zero-supply identity: placeQuadraphage is a no-op', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = handleCellClick(2, 5, state).state;
    const drained = {
      ...state,
      player1Supply: 0,
      player2Supply: 0,
    };
    expect(getSupply(drained, 'player1')).toBe(0);
    expect(placeQuadraphage(drained, { row: 1, col: 4 })).toBe(drained);
  });
});

describe('Wave 20 piece-supply — Juggle board fill rises after monomino', () => {
  it('monomino place increases getBoardFillPercentage', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // die = 1
    let state = juggleRoll(createJuggle());
    expect(state.currentDice).toEqual([1, 1]);
    state = selectDie(state, 0);
    expect(state.selectedShape).not.toBeNull();
    expect(state.phase).toBe('placing');

    const before = getBoardFillPercentage(state.boards.player1);
    let placed = false;
    for (let row = 0; row < state.boards.player1.rows && !placed; row++) {
      for (let col = 0; col < state.boards.player1.cols && !placed; col++) {
        if (isPlacementValid(state, { row, col })) {
          state = placeShape(state, { row, col });
          placed = true;
        }
      }
    }
    expect(placed).toBe(true);
    expect(getBoardFillPercentage(state.boards.player1)).toBeGreaterThan(
      before
    );
  });
});

describe('Wave 20 piece-supply — Prime chip inventory + cell claim', () => {
  it('placeChip decrements playerChips and claims an empty cell', () => {
    let placed = false;
    for (let seed = 0; seed < 40 && !placed; seed++) {
      vi.spyOn(Math, 'random').mockReturnValue(seed / 40);
      let state = createPrime();
      state = primeRoll(state);
      const placements = primePlacements(state);
      if (placements.length === 0) {
        vi.restoreAllMocks();
        continue;
      }
      const target = placements[0];
      const chipsBefore = state.playerChips.player1;
      const emptyBefore = [...state.cells.values()].filter(
        (c) => c.owner === null
      ).length;
      state = placePrime(state, target.value, target.expr);
      expect(state.playerChips.player1).toBe(chipsBefore - 1);
      expect(
        [...state.cells.values()].find((c) => c.value === target.value)?.owner
      ).toBe('player1');
      expect(
        [...state.cells.values()].filter((c) => c.owner === null).length
      ).toBe(emptyBefore - 1);
      placed = true;
      vi.restoreAllMocks();
    }
    expect(placed).toBe(true);
  });
});

describe('Wave 20 piece-supply — Contig claims empty cell inventory', () => {
  it('placeChip owns a previously empty board number', () => {
    // Force known dice into calculating phase (pattern from contig-60-rules.test)
    let state = {
      ...createContig(),
      currentDice: [2, 3, 4] as [number, number, number],
      phase: 'calculating' as const,
    };
    const placements = contigPlacements(state, [2, 3, 4]);
    expect(placements.length).toBeGreaterThan(0);
    const { result, expression } = placements[0];
    expect(state.cells.get(result)?.owner).toBeNull();
    const emptyBefore = [...state.cells.values()].filter(
      (c) => c.owner === null
    ).length;
    state = placeContig(state, result, expression);
    expect(state.cells.get(result)?.owner).toBe('player1');
    expect(
      [...state.cells.values()].filter((c) => c.owner === null).length
    ).toBe(emptyBefore - 1);
  });
});

describe('Wave 20 piece-supply — Kwatro chip position inventory', () => {
  it('moveChip vacates old node and occupies destination', () => {
    let state = createKwa();
    const chips = [...state.chips.values()].filter(
      (c) => c.owner === state.currentPlayer && c.position
    );
    let moved = false;
    for (const chip of chips) {
      state = selectChip(state, chip.id);
      const moves = kwaMoves(state, chip.id);
      if (moves.length === 0) continue;
      const from = chip.position!;
      const to = moves[0];
      state = moveChip(state, to);
      expect(state.chips.get(chip.id)?.position).toBe(to);
      expect(state.nodes.get(from)?.chip).toBeNull();
      expect(state.nodes.get(to)?.chip?.id).toBe(chip.id);
      moved = true;
      break;
    }
    expect(moved).toBe(true);
  });
});

describe('Wave 20 piece-supply — Calla cube totals redistribute', () => {
  it('makeMove empties chosen pit; cubes conserved across pits+callas', () => {
    let state = createCalla();
    const pits = getValidPits(state);
    expect(pits.length).toBeGreaterThan(0);
    const pitIndex = pits[0];
    expect(getPlayerPits(state, 'player1')[pitIndex]).toBeGreaterThan(0);

    const totalBefore =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      getPlayerCalla(state, 'player1') +
      getPlayerCalla(state, 'player2');

    state = callaMove(state, pitIndex);
    expect(getPlayerPits(state, 'player1')[pitIndex]).toBe(0);

    const totalAfter =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      getPlayerCalla(state, 'player1') +
      getPlayerCalla(state, 'player2');
    expect(totalAfter).toBe(totalBefore);
  });
});
