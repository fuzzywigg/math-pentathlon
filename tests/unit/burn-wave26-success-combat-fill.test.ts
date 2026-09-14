/**
 * Wave 26 — multi-ply legal SUCCESS playthroughs (scoring, history, phase advance).
 * Revives never-merged #116 (wave 17 success-playthroughs). Distinct from inventory (#131/#132),
 * seat-handoff, timer/a11y, shell/chrome siblings. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { areEquivalent } from '../../src/core/fractions/arithmetic';
import { Fraction } from '../../src/core/fractions/types';

import { FabADiffyState } from '../../src/games/fab-a-diffy/types';
import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';

import { countMatchingAttributes } from '../../src/games/par-55/types';
import {
  createInitialState as createPar,
  selectBlock as selectPar,
  placeBlock as placePar,
  getValidPlacements as parPlacements,
  calculateScore as parScore,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  getValidPlacements as ramrodPlacements,
  getBoxSum,
  getRemainingValue,
} from '../../src/games/ramrod/rules';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  getValidPlacements as starsPlacements,
} from '../../src/games/stars-bars/rules';

import {
  createInitialState as createKwa,
  selectChip,
  moveChip,
  getValidMoves as kwaMoves,
} from '../../src/games/kwatro-sinko/rules';

import {
  CONFIG as SD_CFG,
  Domino,
  PlacedDomino,
  SumDominoesState,
} from '../../src/games/sum-dominoes/types';
import {
  doRollDice as sumRoll,
  selectDomino,
  placeDomino,
  getValidPlacements as sumPlacements,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';

import {
  createInitialState as createContig,
  getValidPlacements as contigValid,
  ContigState,
  Player as ContigPlayer,
} from '../../src/games/contig-60/types';
import {
  doRollDice as contigRoll,
  placeChip as placeContig,
} from '../../src/games/contig-60/rules';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  getValidPlacements as primePlacements,
  placeChip as placePrime,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  selectIsland,
  calculateDivision,
  findValidIslands,
} from '../../src/games/remainder-islands/rules';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  placeShape,
  getBoardFillPercentage,
} from '../../src/games/juggle/rules';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  rotateSelectedPiece,
  placePiece,
  getValidPlacements as pentPlacements,
  getPieceCells,
} from '../../src/games/pent-em-in/rules';

import {
  createInitialState as createQueens,
  cellKey,
  CONFIG as QG_CFG,
  BoardCoord,
  HexCell,
  Piece,
  QueensGuardsState,
} from '../../src/games/queens-guards/types';
import {
  selectPiece as selectQG,
  makeMove as qgMove,
  getValidMoves as qgMoves,
  checkWinner as qgWinner,
} from '../../src/games/queens-guards/rules';

import {
  createInitialState as createCalla,
  getSideTotalCubes,
  INITIAL_CUBES_PER_PIT,
  PITS_PER_SIDE,
} from '../../src/games/calla/types';
import {
  makeMove as callaMove,
  getValidPits,
  getLastMoveInfo,
} from '../../src/games/calla/rules';

import {
  createInitialState as createHag,
  getAvailableShapes,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  commitSelection,
  selectBlockForPlacement,
  placeBlock as placeHag,
  getValidPlacements as hagPlacements,
  canPlaceAt,
} from '../../src/games/hex-a-gone/rules';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getProgress,
} from '../../src/games/star-track/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function findBarId(state: FabADiffyState, fraction: Fraction): string {
  for (const [id, bar] of state.fractionBars) {
    if (
      !bar.used &&
      bar.fraction.numerator === fraction.numerator &&
      bar.fraction.denominator === fraction.denominator
    ) {
      return id;
    }
  }
  throw new Error(`missing bar ${fraction.numerator}/${fraction.denominator}`);
}

function findAnswerId(state: FabADiffyState, fraction: Fraction): string {
  for (const [id, answer] of state.answerBars) {
    if (answer.claimedBy === null && areEquivalent(answer.fraction, fraction)) {
      return id;
    }
  }
  throw new Error(
    `missing answer ${fraction.numerator}/${fraction.denominator}`
  );
}

function emptySumBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: SD_CFG.BOARD_SIZE }, () =>
    Array.from({ length: SD_CFG.BOARD_SIZE }, () => null)
  );
}

function mkDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function seedSumBoard(
  board: (PlacedDomino | null)[][],
  domino: Domino,
  row: number,
  col: number,
  orientation: 'horizontal' | 'vertical'
): void {
  const placed: PlacedDomino = {
    domino: { ...domino, orientation },
    position: { row, col },
    orientation,
  };
  board[row][col] = placed;
  if (orientation === 'horizontal') board[row][col + 1] = placed;
  else board[row + 1][col] = placed;
}

function claimContig(
  state: ContigState,
  values: number[],
  owner: ContigPlayer
): ContigState {
  const cells = new Map(state.cells);
  for (const value of values) {
    const cell = cells.get(value);
    if (!cell) throw new Error(`missing cell ${value}`);
    cells.set(value, { ...cell, owner });
  }
  return { ...state, cells };
}

function emptyQGCells(): Map<string, HexCell> {
  const cells = new Map<string, HexCell>();
  for (let ring = 0; ring < QG_CFG.NUM_RINGS; ring++) {
    const count = ring === 0 ? 1 : 6 * ring;
    for (let pos = 0; pos < count; pos++) {
      cells.set(cellKey(ring, pos), { ring, position: pos, piece: null });
    }
  }
  return cells;
}

function putQG(
  cells: Map<string, HexCell>,
  ring: number,
  position: number,
  piece: Piece
): void {
  const cell = cells.get(cellKey(ring, position));
  if (cell) cell.piece = piece;
}

describe('Wave 26 — Juggle monomino fill climb', () => {
  it('two monomino plies raise fill % and append history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // [1,1]
    let state = createJuggle();
    const fill0 = getBoardFillPercentage(state.boards.player1);
    state = juggleRoll(state);
    state = selectDie(state, 0);
    expect(state.phase).toBe('placing');
    state = placeShape(state, { row: 0, col: 0 });
    expect(getBoardFillPercentage(state.boards.player1)).toBeGreaterThan(fill0);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player2');

    state = juggleRoll(state);
    state = selectDie(state, 0);
    state = placeShape(state, { row: 1, col: 1 });
    expect(state.moveHistory).toHaveLength(2);
    expect(getBoardFillPercentage(state.boards.player2)).toBeGreaterThan(0);
  });
});

describe('Wave 26 — Pent-Em-In rotate then place success', () => {
  it('select→rotate→place shrinks hand and occupies cells', () => {
    let state = createPent();
    const shapeId = state.player1Pieces.available[0];
    state = selectPiece(state, shapeId);
    expect(state.phase).toBe('placePiece');
    expect(state.selectedPiece).toBe(shapeId);

    const rotated = rotateSelectedPiece(state);
    expect(rotated.selectedRotation).not.toBe(state.selectedRotation);
    state = rotated;

    const spots = pentPlacements(
      state,
      shapeId,
      state.selectedRotation,
      state.selectedFlipped
    );
    expect(spots.length).toBeGreaterThan(0);
    const pos = spots[0];
    const cells = getPieceCells(
      shapeId,
      pos,
      state.selectedRotation,
      state.selectedFlipped
    );
    const availBefore = state.player1Pieces.available.length;
    state = placePiece(
      state,
      shapeId,
      pos,
      state.selectedRotation,
      state.selectedFlipped
    );
    expect(state.player1Pieces.available).not.toContain(shapeId);
    expect(state.player1Pieces.available.length).toBe(availBefore - 1);
    expect(state.placedPieces).toHaveLength(1);
    expect(state.moveHistory).toHaveLength(1);
    for (const c of cells) {
      expect(state.board[c.row][c.col].occupied).toBe(true);
      expect(state.board[c.row][c.col].owner).toBe('player1');
    }
    if (state.phase !== 'gameOver') {
      expect(state.currentPlayer).toBe('player2');
      expect(state.phase).toBe('selectPiece');
    }
  });
});

describe('Wave 26 — Queens & Guards combat midgame ply', () => {
  it('crafted guard move flips seat; capture keeps seat', () => {
    const cells = emptyQGCells();
    putQG(cells, 3, 0, {
      id: 'g1',
      player: 'player1',
      type: 'guard',
    });
    putQG(cells, 3, 2, {
      id: 'g2',
      player: 'player2',
      type: 'guard',
    });
    // Place another p1 piece that can sandwich after move — or just move sideways
    putQG(cells, 5, 0, {
      id: 'q1',
      player: 'player1',
      type: 'queen',
    });

    let state: QueensGuardsState = {
      ...createQueens(),
      cells,
      currentPlayer: 'player1',
      selectedPiece: null,
      capturedPieces: [],
      moveHistory: [],
      winner: null,
    };

    const from: BoardCoord = { ring: 3, position: 0 };
    const moves = qgMoves(state, from);
    expect(moves.length).toBeGreaterThan(0);
    state = selectQG(state, from);
    expect(state.selectedPiece).toBe(cellKey(from.ring, from.position));

    const to = moves[0];
    const beforeCaptured = state.capturedPieces.length;
    state = qgMove(state, from, to);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.cells.get(cellKey(to.ring, to.position))?.piece?.id).toBe(
      'g1'
    );
    expect(
      state.cells.get(cellKey(from.ring, from.position))?.piece
    ).toBeNull();
    expect(qgWinner(state)).toBeNull();

    if (state.capturedPieces.length > beforeCaptured) {
      expect(state.currentPlayer).toBe('player1'); // capture keeps seat
    } else {
      expect(state.currentPlayer).toBe('player2');
    }
  });
});

describe('Wave 26 — Calla sow success + cube conservation', () => {
  it('makeMove redistributes cubes; totals conserved; lastMoveInfo set', () => {
    let state = createCalla();
    const totalBefore =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      state.player1Calla +
      state.player2Calla;
    expect(totalBefore).toBe(INITIAL_CUBES_PER_PIT * PITS_PER_SIDE * 2);

    const pits = getValidPits(state);
    expect(pits.length).toBe(PITS_PER_SIDE);
    // Prefer pit with few cubes for predictable sow (pit 0 usually has 4)
    const pit = pits[0];
    state = callaMove(state, pit);
    const totalAfter =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      state.player1Calla +
      state.player2Calla;
    expect(totalAfter).toBe(totalBefore);
    expect(state.player1Pits[pit]).toBe(0);
    expect(getLastMoveInfo(state)).toBeTruthy();
    expect(state.moveHistory).toHaveLength(1);
    // Free turn if landed in calla, else seat flip
    if (state.currentPlayer === 'player1') {
      expect(state.player1Calla).toBeGreaterThan(0);
    } else {
      expect(state.currentPlayer).toBe('player2');
    }
  });
});

describe('Wave 26 — Star Track draw→select advances seat', () => {
  it('selecting longer chain advances position and progress', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    let state = createStar();
    expect(state.phase).toBe('drawChains');
    state = drawChains(state);
    expect(state.phase).toBe('selectChain');
    expect(state.drawnChains).toHaveLength(2);

    const lengths = state.drawnChains!.map((c) => c.length);
    const longerIdx = (lengths[0] >= lengths[1] ? 0 : 1) as 0 | 1;
    const advance = state.drawnChains![longerIdx].length;
    state = selectChain(state, longerIdx);
    expect(state.player1Position).toBe(Math.min(advance, TRACK_LENGTH));
    expect(getProgress(state, 'player1')).toBe(
      (state.player1Position / TRACK_LENGTH) * 100
    );
    expect(state.moveHistory).toHaveLength(1);
    if (state.player1Position >= TRACK_LENGTH) {
      expect(state.phase).toBe('gameOver');
      expect(state.winner).toBe('player1');
    } else {
      expect(state.currentPlayer).toBe('player2');
      expect(state.phase).toBe('drawChains');
    }
  });
});

describe('Wave 26 combat deepen — Juggle three monomino plies', () => {
  it('three monomino fills grow history and fill percent', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createJuggle();
    const coords = [
      { row: 0, col: 0 },
      { row: 2, col: 2 },
      { row: 3, col: 3 },
    ];
    for (let i = 0; i < 3; i++) {
      state = juggleRoll(state);
      state = selectDie(state, 0);
      const seat = state.currentPlayer;
      const before = getBoardFillPercentage(state.boards[seat]);
      state = placeShape(state, coords[i]);
      expect(getBoardFillPercentage(state.boards[seat])).toBeGreaterThan(
        before
      );
      expect(state.moveHistory).toHaveLength(i + 1);
    }
  });
});

describe('Wave 26 combat deepen — Calla two sow plies', () => {
  it('two makeMove plies conserve cubes and grow history', () => {
    let state = createCalla();
    const total0 =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      state.player1Calla +
      state.player2Calla;
    for (let i = 0; i < 2; i++) {
      const pits = getValidPits(state);
      expect(pits.length).toBeGreaterThan(0);
      state = callaMove(state, pits[Math.min(1, pits.length - 1)]);
      expect(state.moveHistory).toHaveLength(i + 1);
    }
    const totalN =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      state.player1Calla +
      state.player2Calla;
    expect(totalN).toBe(total0);
  });
});

describe('Wave 26 combat deepen — Star Track two draws', () => {
  it('two selectChain plies advance both seats when game continues', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    let state = createStar();
    state = drawChains(state);
    state = selectChain(state, 0);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.player1Position).toBeGreaterThan(0);
    if (state.phase === 'drawChains') {
      state = drawChains(state);
      state = selectChain(state, 1);
      expect(state.moveHistory).toHaveLength(2);
      expect(state.player2Position).toBeGreaterThan(0);
    }
  });
});

describe('Wave 26 combat deepen — Queens second combat ply', () => {
  it('after first move, opponent can relocate a guard', () => {
    const cells = emptyQGCells();
    putQG(cells, 3, 0, { id: 'g1', player: 'player1', type: 'guard' });
    putQG(cells, 3, 3, { id: 'g2', player: 'player2', type: 'guard' });
    putQG(cells, 5, 0, { id: 'q1', player: 'player1', type: 'queen' });
    putQG(cells, 5, 3, { id: 'q2', player: 'player2', type: 'queen' });

    let state: QueensGuardsState = {
      ...createQueens(),
      cells,
      currentPlayer: 'player1',
      selectedPiece: null,
      capturedPieces: [],
      moveHistory: [],
      winner: null,
    };

    const from1: BoardCoord = { ring: 3, position: 0 };
    const moves1 = qgMoves(state, from1);
    expect(moves1.length).toBeGreaterThan(0);
    state = selectQG(state, from1);
    state = qgMove(state, from1, moves1[0]);
    expect(state.moveHistory).toHaveLength(1);

    if (state.currentPlayer === 'player2' && !state.winner) {
      const from2: BoardCoord = { ring: 3, position: 3 };
      const piece = state.cells.get(cellKey(from2.ring, from2.position))?.piece;
      if (piece?.player === 'player2') {
        const moves2 = qgMoves(state, from2);
        if (moves2.length > 0) {
          state = selectQG(state, from2);
          state = qgMove(state, from2, moves2[0]);
          expect(state.moveHistory).toHaveLength(2);
        }
      }
    }
  });
});
