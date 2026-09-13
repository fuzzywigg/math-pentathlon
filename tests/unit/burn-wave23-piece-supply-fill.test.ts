/**
 * Wave 23 — piece / supply / board-fill / position inventory after legal success.
 * Distinct from wave 18 geometry transforms, wave 19 serialization/lookup,
 * wave 20 board-bounds, wave 21 polyomino-solve. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createPent,
  getPlayerPieces,
  PIECES_PER_PLAYER,
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
import { CONFIG as PRIME_CFG } from '../../src/games/prime-gold/types';

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
  TOTAL_CUBES,
} from '../../src/games/calla/types';
import { getValidPits, makeMove as callaMove } from '../../src/games/calla/rules';

import {
  createInitialState as createHex,
  createEmptyBoard,
} from '../../src/games/hex/types';
import { makeMove as hexMake, isCellEmpty } from '../../src/games/hex/rules';

import {
  createInitialState as createQueens,
  cellKey,
} from '../../src/games/queens-guards/types';
import {
  selectPiece as qgSelect,
  getValidMoves as qgMoves,
  makeMove as qgMove,
} from '../../src/games/queens-guards/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 23 piece-supply — Pent-em-In available→placed', () => {
  it('placePiece moves shapeId from available to placed', () => {
    let state = createPent();
    const pieces = getPlayerPieces(state, 'player1');
    expect(pieces.available.length).toBe(PIECES_PER_PLAYER);
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

  it('second piece for same seat further shrinks available ledger', () => {
    let state = createPent();
    const first = getPlayerPieces(state, 'player1').available[0];
    state = selectPiece(state, first);
    state = placePiece(
      state,
      first,
      pentPlacements(state, first, 0, false)[0],
      0,
      false
    );
    expect(getPlayerPieces(state, 'player1').available.length).toBe(
      PIECES_PER_PLAYER - 1
    );

    // Opponent place to return seat if needed
    if (state.currentPlayer === 'player2') {
      const opp = getPlayerPieces(state, 'player2').available[0];
      state = selectPiece(state, opp);
      const spots = pentPlacements(state, opp, 0, false);
      if (spots.length > 0) {
        state = placePiece(state, opp, spots[0], 0, false);
      }
    }

    if (state.currentPlayer !== 'player1') return;
    const second = getPlayerPieces(state, 'player1').available[0];
    state = selectPiece(state, second);
    const spots = pentPlacements(state, second, 0, false);
    if (spots.length === 0) return;
    state = placePiece(state, second, spots[0], 0, false);
    expect(getPlayerPieces(state, 'player1').available.length).toBe(
      PIECES_PER_PLAYER - 2
    );
    expect(getPlayerPieces(state, 'player1').placed).toContain(second);
  });
});

describe('Wave 23 piece-supply — Kings Quadraphages supply ledger', () => {
  it('opening supply is INITIAL_QUADRAPHAGE_COUNT; place drops by 1', () => {
    let state = createInitialGameState();
    expect(getSupply(state, 'player1')).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(getSupply(state, 'player2')).toBe(INITIAL_QUADRAPHAGE_COUNT);

    state = selectKing(state);
    state = handleCellClick(2, 5, state).state;
    expect(state.turnPhase).toBe('placeQuadraphage');

    const before = getSupply(state, 'player1');
    const oppBefore = getSupply(state, 'player2');
    state = placeQuadraphage(state, { row: 1, col: 4 });
    expect(getSupply(state, 'player1')).toBe(before - 1);
    expect(getSupply(state, 'player2')).toBe(oppBefore);
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

  it('supply+board quads track INITIAL×2 after one place', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = handleCellClick(2, 5, state).state;
    state = placeQuadraphage(state, { row: 1, col: 4 });
    const quadsOnBoard = state.board
      .flat()
      .filter((c) => c?.type === 'quadraphage').length;
    expect(quadsOnBoard).toBe(1);
    expect(
      getSupply(state, 'player1') + getSupply(state, 'player2') + quadsOnBoard
    ).toBe(INITIAL_QUADRAPHAGE_COUNT * 2);
  });
});

describe('Wave 23 piece-supply — Juggle board fill rises after monomino', () => {
  it('monomino place increases getBoardFillPercentage by exact cell delta', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // die = 1
    let state = juggleRoll(createJuggle());
    expect(state.currentDice).toEqual([1, 1]);
    state = selectDie(state, 0);
    expect(state.selectedShape).not.toBeNull();
    expect(state.phase).toBe('placing');

    const board = state.boards.player1;
    const totalCells = board.rows * board.cols;
    const before = getBoardFillPercentage(board);
    let placed = false;
    for (let row = 0; row < board.rows && !placed; row++) {
      for (let col = 0; col < board.cols && !placed; col++) {
        if (isPlacementValid(state, { row, col })) {
          state = placeShape(state, { row, col });
          placed = true;
        }
      }
    }
    expect(placed).toBe(true);
    const after = getBoardFillPercentage(state.boards.player1);
    expect(after).toBeGreaterThan(before);
    // Implementation rounds to integer percent — monomino on empty board → 1%
    expect(after).toBe(1);
    expect(totalCells).toBeGreaterThan(1);
  });
});

describe('Wave 23 piece-supply — Prime chip inventory + cell claim', () => {
  it('placeChip decrements playerChips and claims an empty cell', () => {
    let placed = false;
    for (let seed = 0; seed < 40 && !placed; seed++) {
      vi.spyOn(Math, 'random').mockReturnValue(seed / 40);
      let state = createPrime();
      expect(state.playerChips.player1).toBe(PRIME_CFG.STARTING_CHIPS);
      state = primeRoll(state);
      const placements = primePlacements(state);
      if (placements.length === 0) {
        vi.restoreAllMocks();
        continue;
      }
      const target = placements[0];
      const chipsBefore = state.playerChips.player1;
      const oppBefore = state.playerChips.player2;
      const emptyBefore = [...state.cells.values()].filter(
        (c) => c.owner === null
      ).length;
      state = placePrime(state, target.value, target.expr);
      expect(state.playerChips.player1).toBe(chipsBefore - 1);
      expect(state.playerChips.player2).toBe(oppBefore);
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

describe('Wave 23 piece-supply — Contig claims empty cell inventory', () => {
  it('placeChip owns a previously empty board number', () => {
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

describe('Wave 23 piece-supply — Kwatro chip position inventory', () => {
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
      // Chip count conserved
      expect([...state.chips.values()].length).toBe(10);
      moved = true;
      break;
    }
    expect(moved).toBe(true);
  });
});

describe('Wave 23 piece-supply — Calla cube totals redistribute', () => {
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
    expect(totalBefore).toBe(TOTAL_CUBES);

    state = callaMove(state, pitIndex);
    expect(getPlayerPits(state, 'player1')[pitIndex]).toBe(0);

    const totalAfter =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      getPlayerCalla(state, 'player1') +
      getPlayerCalla(state, 'player2');
    expect(totalAfter).toBe(TOTAL_CUBES);
  });
});

describe('Wave 23 piece-supply — Hex cell occupancy inventory', () => {
  it('makeMove claims empty cell; opponent board empty-count drops by 1', () => {
    const size = 5;
    let state = createHex(size);
    const emptyBefore = createEmptyBoard(size)
      .flat()
      .filter((c) => c === null).length;
    expect(isCellEmpty(state.board, { row: 2, col: 2 })).toBe(true);
    state = hexMake(state, { row: 2, col: 2 });
    expect(state.board[2][2]).toBe('player1');
    const emptyAfter = state.board.flat().filter((c) => c === null).length;
    expect(emptyAfter).toBe(emptyBefore - 1);
    expect(state.currentPlayer).toBe('player2');
  });
});

describe('Wave 23 piece-supply — Queens piece relocation inventory', () => {
  it('makeMove relocates piece without inventing new piece ids', () => {
    let state = createQueens();
    const piecesBefore = [...state.cells.values()].filter((c) => c.piece).length;
    const idsBefore = [...state.cells.values()]
      .filter((c) => c.piece)
      .map((c) => c.piece!.id)
      .sort();

    // Find a movable piece for current player
    let moved = false;
    for (const cell of state.cells.values()) {
      if (!cell.piece || cell.piece.player !== state.currentPlayer) continue;
      const from = { ring: cell.ring, position: cell.position };
      state = qgSelect(state, from);
      const moves = qgMoves(state, from);
      if (moves.length === 0) continue;
      const to = moves[0];
      state = qgMove(state, from, to);
      expect(state.cells.get(cellKey(from.ring, from.position))?.piece).toBeNull();
      expect(state.cells.get(cellKey(to.ring, to.position))?.piece?.id).toBe(
        cell.piece.id
      );
      moved = true;
      break;
    }
    expect(moved).toBe(true);

    const piecesAfter = [...state.cells.values()].filter((c) => c.piece).length;
    // Capture may remove pieces from board into capturedPieces
    expect(piecesAfter + state.capturedPieces.length).toBe(piecesBefore);
    const idsAfter = [
      ...[...state.cells.values()]
        .filter((c) => c.piece)
        .map((c) => c.piece!.id),
    ].sort();
    expect(idsAfter.every((id) => idsBefore.includes(id))).toBe(true);
  });
});
