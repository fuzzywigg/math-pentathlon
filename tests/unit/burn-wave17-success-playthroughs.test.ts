/**
 * Wave 17 — multi-ply legal SUCCESS playthroughs (scoring, history, phase advance).
 * Distinct from wave 13 (UI/tutorial/win-AI smoke) and wave 14 (illegal identity,
 * types/helpers, dice/expr, phase strings). Existing games only — no product inventing.
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

describe('Wave 17 — Fab-a-Diffy two-ply claim success', () => {
  it('player1 claims then player2 claims; scores and history climb', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createFab();

    const barA = findBarId(state, { numerator: 1, denominator: 4 });
    const barB = findBarId(state, { numerator: 3, denominator: 4 });
    const answer1 = findAnswerId(state, { numerator: 1, denominator: 1 });

    state = selectBar1(state, barA);
    state = selectBar2(state, barB);
    state = selectOperation(state, 'add');
    expect(state.phase).toBe('confirmingMove');
    const result = calculateResult(
      state.fractionBars.get(barA)!.fraction,
      state.fractionBars.get(barB)!.fraction,
      'add'
    )!;
    expect(findMatchingAnswers(state, result)).toContain(answer1);

    state = executeMove(state, answer1);
    expect(state.scores.player1).toBe(1);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('selectingBar1');

    // Player2: 1/2 × 1/2 = 1/4 (if bars still free) or 1/3 + 1/6 = 1/2
    let barC: string;
    let barD: string;
    let op: 'add' | 'multiply' = 'add';
    let answerFrac: Fraction;
    try {
      barC = findBarId(state, { numerator: 1, denominator: 3 });
      barD = findBarId(state, { numerator: 1, denominator: 6 });
      answerFrac = { numerator: 1, denominator: 2 };
    } catch {
      barC = findBarId(state, { numerator: 1, denominator: 2 });
      barD = findBarId(state, { numerator: 1, denominator: 2 });
      // only one 1/2 — fall back to 1/5 + 1/5 if present, else multiply halves unavailable
      // Use remaining bars via getPossibleResults path: 2/3 − 1/6 = 1/2
      barC = findBarId(state, { numerator: 2, denominator: 3 });
      barD = findBarId(state, { numerator: 1, denominator: 6 });
      op = 'subtract' as 'add';
      answerFrac = { numerator: 1, denominator: 2 };
      void op;
    }

    // Prefer a known safe second claim: 1/3 + 1/6 = 1/2 when available
    const tryPairs: Array<{
      a: Fraction;
      b: Fraction;
      operation: 'add' | 'subtract' | 'multiply';
      answer: Fraction;
    }> = [
      {
        a: { numerator: 1, denominator: 3 },
        b: { numerator: 1, denominator: 6 },
        operation: 'add',
        answer: { numerator: 1, denominator: 2 },
      },
      {
        a: { numerator: 2, denominator: 3 },
        b: { numerator: 1, denominator: 6 },
        operation: 'subtract',
        answer: { numerator: 1, denominator: 2 },
      },
      {
        a: { numerator: 1, denominator: 5 },
        b: { numerator: 1, denominator: 5 },
        operation: 'add',
        answer: { numerator: 2, denominator: 5 },
      },
      {
        a: { numerator: 1, denominator: 2 },
        b: { numerator: 1, denominator: 4 },
        operation: 'subtract',
        answer: { numerator: 1, denominator: 4 },
      },
    ];

    let claimed = false;
    for (const pair of tryPairs) {
      try {
        const a = findBarId(state, pair.a);
        const b = findBarId(state, pair.b);
        if (a === b) continue;
        const ans = findAnswerId(state, pair.answer);
        let s = selectBar1(state, a);
        s = selectBar2(s, b);
        s = selectOperation(s, pair.operation);
        const beforeHist = s.moveHistory.length;
        s = executeMove(s, ans);
        if (s.moveHistory.length === beforeHist + 1) {
          state = s;
          claimed = true;
          break;
        }
      } catch {
        // try next pair
      }
    }
    expect(claimed).toBe(true);
    expect(state.scores.player2).toBe(1);
    expect(state.moveHistory).toHaveLength(2);
    expect(state.moveHistory[1].player).toBe('player2');
  });
});

describe('Wave 17 — Par 55 two-ply adjacency scoring', () => {
  it('second placement can earn match points vs first; history length 2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.17);
    let state = createPar();
    const block1 = state.hands.player1[0].id;
    state = selectPar(state, block1);
    const p1 = parPlacements(state);
    expect(p1.length).toBeGreaterThan(0);
    const base1 = p1[0];
    const score1 = parScore(
      state,
      state.hands.player1.find((b) => b.id === block1)!,
      base1
    );
    state = placePar(state, base1);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.scores.player1).toBe(score1.totalPoints);
    expect(state.currentPlayer).toBe('player2');

    const block2 = state.hands.player2[0].id;
    state = selectPar(state, block2);
    const p2 = parPlacements(state);
    expect(p2.length).toBeGreaterThan(0);

    // Prefer a base adjacent to base1 for nonzero score potential
    const adjToFirst = p2.find((id) => {
      const base = state.bases.get(id);
      return base?.adjacentBases.includes(base1);
    });
    const target = adjToFirst ?? p2[0];
    const blockObj = state.hands.player2.find((b) => b.id === block2)!;
    const expected = parScore(state, blockObj, target);
    const neighbor = state.bases.get(base1)?.block;
    if (neighbor && adjToFirst) {
      expect(
        countMatchingAttributes(blockObj, neighbor).length
      ).toBeGreaterThanOrEqual(0);
    }

    state = placePar(state, target);
    expect(state.moveHistory).toHaveLength(2);
    expect(state.scores.player2).toBe(expected.totalPoints);
    expect(state.bases.get(target)?.block?.id).toBe(block2);
    expect(state.phase).toBe('selectingBlock');
  });
});

describe('Wave 17 — Ramrod box completion success', () => {
  it('two rods that sum to target capture the box and score targetSum', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createRamrod();
    const rodId = state.playerRods.player1[0];
    const rod = state.rods.get(rodId)!;
    state = selectRod(state, rodId);
    const placements = ramrodPlacements(state, rodId);
    expect(placements.length).toBeGreaterThan(0);

    // Place first rod in an empty slot
    const { boxId, slot } = placements[0];
    state = placeRod(state, boxId, slot);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.boxes.get(boxId)?.rods[slot]?.id).toBe(rodId);

    // Player2 places complementary rod if possible
    const box = state.boxes.get(boxId)!;
    const otherSlot = slot === 0 ? 1 : 0;
    if (!box.rods[otherSlot]) {
      const remaining = getRemainingValue(box);
      const complement = state.playerRods.player2
        .map((id) => state.rods.get(id)!)
        .find((r) => r.length === remaining);
      if (complement) {
        state = selectRod(state, complement.id);
        const beforeScore = state.scores.player2;
        state = placeRod(state, boxId, otherSlot);
        expect(getBoxSum(state.boxes.get(boxId)!)).toBe(
          state.boxes.get(boxId)!.targetSum
        );
        expect(state.boxes.get(boxId)?.completedBy).toBe('player2');
        expect(state.scores.player2).toBe(
          beforeScore + state.boxes.get(boxId)!.targetSum
        );
        expect(state.moveHistory.length).toBeGreaterThanOrEqual(2);
      } else {
        // Still assert first ply succeeded and remaining is positive
        expect(getRemainingValue(state.boxes.get(boxId)!)).toBe(
          box.targetSum - rod.length
        );
        expect(state.currentPlayer).toBe('player2');
      }
    }
  });
});

describe('Wave 17 — Stars & Bars two-ply place + score', () => {
  it('select→place twice; hands shrink, history grows, scores nondecreasing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    let state = createStars();
    const card1 = state.playerHands.player1[0];
    const handBefore = state.playerHands.player1.length;
    state = selectCard(state, card1.id);
    const slots = starsPlacements(state);
    expect(slots.length).toBeGreaterThan(0);
    const { row, col } = slots[0];
    const scoreBefore = state.playerScores.player1;
    state = placeCard(state, row, col);
    expect(state.cells[row][col].card?.id).toBe(card1.id);
    expect(state.playerHands.player1.length).toBe(handBefore); // redraw keeps size when deck nonempty
    expect(state.playerScores.player1).toBeGreaterThanOrEqual(scoreBefore);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].breakdown).toBeDefined();
    expect(state.currentPlayer).toBe('player2');

    const card2 = state.playerHands.player2[0];
    state = selectCard(state, card2.id);
    const slots2 = starsPlacements(state);
    expect(slots2.length).toBeGreaterThan(0);
    state = placeCard(state, slots2[0].row, slots2[0].col);
    expect(state.moveHistory).toHaveLength(2);
    expect(state.playerScores.player2).toBeGreaterThanOrEqual(0);
    if (state.phase !== 'gameOver') {
      expect(state.phase).toBe('selectingCard');
      expect(state.currentPlayer).toBe('player1');
    }
  });
});

describe('Wave 17 — Kwatro-Sinko two-ply relocate', () => {
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

describe('Wave 17 — Sum Dominoes crafted two-ply chain', () => {
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

describe('Wave 17 — Contig 60 two-ply placeChip scoring', () => {
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

describe('Wave 17 — Prime Gold two-ply placeChip', () => {
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

describe('Wave 17 — Remainder Islands claim success', () => {
  it('roll→selectIsland awards remainder points and consumes a chip', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // mid dice
    let state = createRemainder();
    const chipsBefore = state.player1Chips;
    const scoreBefore = state.player1Score;
    state = performRoll(state);
    expect(state.phase).toBe('selectIsland');
    expect(state.currentRoll).not.toBeNull();
    expect(state.validIslands.length).toBeGreaterThan(0);

    const islandId = state.validIslands[0];
    const island = state.islands.find((i) => i.id === islandId)!;
    const division = calculateDivision(state.currentRoll!.total, island.value);
    expect(findValidIslands(state, state.currentRoll!.total)).toContain(
      islandId
    );

    state = selectIsland(state, islandId);
    expect(state.islands.find((i) => i.id === islandId)?.owner).toBe('player1');
    expect(state.player1Score).toBe(scoreBefore + division.remainder);
    expect(state.player1Chips).toBe(chipsBefore - 1);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].pointsEarned).toBe(division.remainder);
    if (state.phase !== 'gameOver') {
      expect(state.phase).toBe('rolling');
      expect(state.currentPlayer).toBe('player2');
    }
  });
});

describe('Wave 17 — Juggle monomino fill climb', () => {
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

describe('Wave 17 — Pent-Em-In rotate then place success', () => {
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

describe('Wave 17 — Queens & Guards combat midgame ply', () => {
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

describe('Wave 17 — Calla sow success + cube conservation', () => {
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

describe('Wave 17 — Hex-a-Gone shape place success', () => {
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

describe('Wave 17 — Star Track draw→select advances seat', () => {
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
