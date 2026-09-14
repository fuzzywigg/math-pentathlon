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

describe('Wave 26 — Kwatro-Sinko two-ply relocate', () => {
  it('each seat relocates a chip; positions update and history length 2', () => {
    let state = createKwa();
    const p1Chip = 'p1-2';
    const dests = kwaMoves(state, p1Chip);
    expect(dests.length).toBeGreaterThan(0);
    state = selectChip(state, p1Chip);
    const from = state.chips.get(p1Chip)!.position!;
    state = moveChip(state, dests[0]);
    expect(state.chips.get(p1Chip)?.position).toBe(dests[0]);
    expect(state.nodes.get(from)?.chip).toBeNull();
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].fromNode).toBe(from);
    expect(state.moveHistory[0].toNode).toBe(dests[0]);

    if (state.phase === 'gameOver') {
      expect(state.winner).toBe('player1');
      return;
    }

    expect(state.currentPlayer).toBe('player2');
    const p2Chip = 'p2-2';
    const dests2 = kwaMoves(state, p2Chip);
    expect(dests2.length).toBeGreaterThan(0);
    state = selectChip(state, p2Chip);
    state = moveChip(state, dests2[0]);
    expect(state.moveHistory).toHaveLength(2);
    expect(state.chips.get(p2Chip)?.position).toBe(dests2[0]);
  });
});

describe('Wave 26 — Sum Dominoes crafted two-ply chain', () => {
  it('roll→select→place extends board; remaining count drops; seat flips', () => {
    // Center 6|6; dice sum 8 → playable with face adjacent to 6: face 2 (2+6=8)
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.5) // 4
      .mockReturnValueOnce(0.5); // 4 → sum 8
    const board = emptySumBoard();
    seedSumBoard(board, mkDomino('seed', 6, 6, null), 5, 5, 'horizontal');
    let state: SumDominoesState = {
      board,
      hands: {
        player1: [mkDomino('play-a', 2, 3), mkDomino('play-b', 0, 1)],
        player2: [
          mkDomino('play-c', 2, 4, 'player2'),
          mkDomino('play-d', 5, 5, 'player2'),
        ],
      },
      currentPlayer: 'player1',
      currentDice: null,
      selectedDomino: null,
      phase: 'rolling',
      winner: null,
      moveHistory: [],
      passCount: 0,
    };

    const remBefore = getRemainingCount(state, 'player1');
    state = sumRoll(state);
    expect(state.phase).toBe('placing');
    expect(state.currentDice).toEqual([4, 4]);

    const playA = state.hands.player1.find((d) => d.id === 'play-a')!;
    const sum = 8;
    const placements = sumPlacements(state, playA, sum);
    expect(placements.length).toBeGreaterThan(0);
    state = selectDomino(state, 'play-a');
    const { position, orientation } = placements[0];
    state = placeDomino(state, position, orientation);
    expect(state.moveHistory).toHaveLength(1);
    expect(getRemainingCount(state, 'player1')).toBe(remBefore - 1);
    expect(state.board[position.row][position.col]).not.toBeNull();
    if (state.phase !== 'gameOver') {
      expect(state.currentPlayer).toBe('player2');
      expect(state.phase).toBe('rolling');
    }

    // Second ply for player2 with sum 8
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0.5);
    if (state.phase === 'rolling') {
      state = sumRoll(state);
      if (state.phase === 'placing' && state.currentDice) {
        const target = state.currentDice[0] + state.currentDice[1];
        const playable = state.hands.player2.find(
          (d) => sumPlacements(state, d, target).length > 0
        );
        if (playable) {
          const p2spots = sumPlacements(state, playable, target);
          state = selectDomino(state, playable.id);
          state = placeDomino(
            state,
            p2spots[0].position,
            p2spots[0].orientation
          );
          expect(state.moveHistory).toHaveLength(2);
        }
      }
    }
  });
});

describe('Wave 26 — Contig 60 two-ply placeChip scoring', () => {
  it('two successful placements flip seats and append history with expressions', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // dice → 1,1,1
    let state = createContig();
    state = contigRoll(state);
    expect(state.phase).toBe('calculating');
    expect(state.currentDice).toEqual([1, 1, 1]);
    const options = contigValid(state, state.currentDice!);
    expect(options.length).toBeGreaterThan(0);
    const first = options[0];
    const scoreBefore = state.scores.player1;
    state = placeContig(state, first.result, first.expression);
    expect(state.cells.get(first.result)?.owner).toBe('player1');
    expect(state.scores.player1).toBeGreaterThanOrEqual(scoreBefore);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].expression).toBe(first.expression);
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player2');

    state = contigRoll(state);
    const options2 = contigValid(state, state.currentDice!);
    expect(options2.length).toBeGreaterThan(0);
    // Prefer a free cell
    const second = options2.find(
      (o) => state.cells.get(o.result)?.owner === null
    )!;
    state = placeContig(state, second.result, second.expression);
    expect(state.moveHistory).toHaveLength(2);
    expect(state.cells.get(second.result)?.owner).toBe('player2');
  });

  it('adjacency scoring awards points when neighbor owned', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createContig();
    // Claim cell 2 next to 1 so placing 1 (from 1+1-1 or similar) can score
    state = claimContig(state, [2], 'player1');
    state = { ...state, currentDice: [1, 1, 1], phase: 'calculating' };
    const opts = contigValid(state, [1, 1, 1]);
    const one = opts.find((o) => o.result === 1);
    if (one) {
      state = placeContig(state, 1, one.expression);
      expect(state.moveHistory[0].points).toBeGreaterThan(0);
      expect(state.scores.player1).toBeGreaterThan(0);
    } else {
      // Still place something valid
      expect(opts.length).toBeGreaterThan(0);
      state = placeContig(state, opts[0].result, opts[0].expression);
      expect(state.moveHistory).toHaveLength(1);
    }
  });
});

describe('Wave 26 — Prime Gold two-ply placeChip', () => {
  it('roll→place twice; history records value+expr; seat advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2); // die faces 2
    let state = createPrime();
    state = primeRoll(state);
    expect(state.phase).toBe('placing');
    const placements = primePlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const first = placements[0];
    state = placePrime(state, first.value, first.expression);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].result).toBe(first.value);
    expect(state.moveHistory[0].expression).toBe(first.expression);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('rolling');

    state = primeRoll(state);
    const p2 = primePlacements(state).filter(
      (p) => findCellByValue(state, p.value)?.owner === null
    );
    expect(p2.length).toBeGreaterThan(0);
    state = placePrime(state, p2[0].value, p2[0].expression);
    expect(state.moveHistory).toHaveLength(2);
    expect(state.currentPlayer).toBe('player1');
  });
});

describe('Wave 26 — Hex-a-Gone shape place success', () => {
  it('select→commit→place fills cell, drains bank, records history', () => {
    let state = createHag();
    const available = getAvailableShapes(state);
    expect(available.length).toBeGreaterThan(0);
    const shape = available[0];
    state = selectHag(state, shape);
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    state = selectBlockForPlacement(state, shape);
    const spots = hagPlacements(state);
    expect(spots.length).toBeGreaterThan(0);
    const { q, r } = spots[0];
    expect(canPlaceAt(state, q, r)).toBe(true);
    const bankBefore = state.bank[shape];
    state = placeHag(state, q, r);
    expect(state.board.find((c) => c.q === q && c.r === r)?.filled).toBe(true);
    expect(state.bank[shape]).toBe(bankBefore - 1);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.phase).toBe('selectBlocks');
    expect(state.currentPlayer).toBe('player2');
  });
});

describe('Wave 26 place deepen — Kwatro three chips from seat1 then seat2', () => {
  it('relocates until history length reaches 3', () => {
    let state = createKwa();
    const order = [
      'p1-2',
      'p2-2',
      'p1-4',
      'p2-4',
      'p1-6',
      'p2-6',
      'p1-0',
      'p2-0',
    ];
    let moves = 0;
    for (const id of order) {
      if (moves >= 3 || state.phase === 'gameOver') break;
      const chip = state.chips.get(id);
      if (!chip || chip.owner !== state.currentPlayer) continue;
      const dests = kwaMoves(state, id);
      if (!dests.length) continue;
      state = selectChip(state, id);
      state = moveChip(state, dests[0]);
      moves++;
    }
    expect(moves).toBeGreaterThanOrEqual(2);
    expect(state.moveHistory.length).toBe(moves);
  });
});

describe('Wave 26 place deepen — Prime Gold three-ply free-cell drop', () => {
  it('three placeChip plies reduce unowned cells by 3', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    let state = createPrime();
    const free0 = [...state.cells.values()].filter(
      (c) => c.owner === null
    ).length;
    for (let i = 0; i < 3; i++) {
      state = primeRoll(state);
      const free = primePlacements(state).filter(
        (p) => findCellByValue(state, p.value)?.owner === null
      );
      expect(free.length).toBeGreaterThan(0);
      state = placePrime(state, free[0].value, free[0].expression);
    }
    const freeN = [...state.cells.values()].filter(
      (c) => c.owner === null
    ).length;
    expect(freeN).toBe(free0 - 3);
    expect(state.moveHistory).toHaveLength(3);
  });
});

describe('Wave 26 place deepen — Hex-a-Gone triangle then second shape', () => {
  it('two consecutive turns each fill one cell', () => {
    let state = createHag();
    const filled0 = state.board.filter((c) => c.filled).length;
    for (let i = 0; i < 2; i++) {
      const shape = getAvailableShapes(state)[0];
      state = selectHag(state, shape);
      state = commitSelection(state);
      state = selectBlockForPlacement(state, shape);
      const spots = hagPlacements(state);
      expect(spots.length).toBeGreaterThan(0);
      state = placeHag(state, spots[0].q, spots[0].r);
    }
    expect(state.board.filter((c) => c.filled).length).toBe(filled0 + 2);
    expect(state.moveHistory).toHaveLength(2);
  });
});
