import { describe, it, expect, vi, afterEach } from 'vitest';
import { areEquivalent } from '../../src/core/fractions/arithmetic';
import { Fraction } from '../../src/core/fractions/types';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
} from '../../src/games/fab-a-diffy/rules';
import { getAIMove as getFabAIMove } from '../../src/games/fab-a-diffy/ai';
import { FabADiffyState } from '../../src/games/fab-a-diffy/types';

import {
  createInitialState as createJuggle,
  placeShape,
  isPlacementValid,
  selectDie,
} from '../../src/games/juggle/rules';
import { getShapeById } from '../../src/games/juggle/types';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement as getJugglePlacement,
} from '../../src/games/juggle/ai';

import {
  createInitialState as createHex,
  HexBoard,
  Player,
} from '../../src/games/hex/types';
import { makeMove, getValidMoves } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

import {
  createInitialState as createQueens,
  cellKey,
  BoardCoord,
  CONFIG as QG_CFG,
} from '../../src/games/queens-guards/types';
import {
  hasValidMoves,
  getValidMoves as qgValidMoves,
} from '../../src/games/queens-guards/rules';
import {
  getAIMove as getQueensAI,
  applyAIMove,
} from '../../src/games/queens-guards/ai';

import {
  createInitialState as createContig,
  getValidPlacements as getContigPlacements,
} from '../../src/games/contig-60/types';
import { doRollDice, calculatePoints } from '../../src/games/contig-60/rules';
import {
  getAIPlacement as getContigAI,
  executeAITurn as executeContigAI,
} from '../../src/games/contig-60/ai';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  selectChain,
  isGameOver,
  getProgress,
  drawChains,
} from '../../src/games/star-track/rules';
import { getAIChainChoice } from '../../src/games/star-track/ai';

import {
  placeDomino,
  passTurn,
  getValidPlacements as getSumPlacements,
} from '../../src/games/sum-dominoes/rules';
import {
  Domino,
  PlacedDomino,
  SumDominoesState,
  CONFIG as SD_CFG,
} from '../../src/games/sum-dominoes/types';
import {
  getAIMove as getSumAI,
  hasPlayableMove,
} from '../../src/games/sum-dominoes/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as getParAI } from '../../src/games/par-55/ai';
import { CONFIG as PAR_CFG } from '../../src/games/par-55/types';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { getValidPits } from '../../src/games/calla/rules';
import { analyzeMoves, getAIMove as getCallaAI } from '../../src/games/calla/ai';

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

function hexBoard(
  size: number,
  cells: Array<{ row: number; col: number; player: Player }>
): HexBoard {
  const board: HexBoard = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
  for (const cell of cells) {
    board[cell.row][cell.col] = cell.player;
  }
  return board;
}

function tinyQueensGuard() {
  const state = createQueens();
  const cells = new Map(state.cells);
  for (const [key, cell] of cells) {
    cells.set(key, { ...cell, piece: null });
  }
  const from: BoardCoord = { ring: 2, position: 0 };
  cells.set(cellKey(from.ring, from.position), {
    ...cells.get(cellKey(from.ring, from.position))!,
    piece: { type: 'guard', player: 'player1' },
  });
  const opp: BoardCoord = { ring: QG_CFG.NUM_RINGS - 1, position: 0 };
  cells.set(cellKey(opp.ring, opp.position), {
    ...cells.get(cellKey(opp.ring, opp.position))!,
    piece: { type: 'queen', player: 'player2' },
  });
  return {
    ...state,
    cells,
    currentPlayer: 'player1' as const,
    selectedPiece: null,
  };
}

function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function emptySumBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: SD_CFG.BOARD_SIZE }, () =>
    Array.from({ length: SD_CFG.BOARD_SIZE }, () => null)
  );
}

function placeOnBoard(
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

function sumBase(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  const board = emptySumBoard();
  placeOnBoard(board, makeDomino('seed', 6, 6, null), 5, 5, 'horizontal');

  return {
    board,
    hands: {
      player1: [makeDomino('p1a', 2, 1)],
      player2: [makeDomino('p2a', 5, 5, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: [4, 4],
    selectedDomino: null,
    phase: 'placing',
    passCount: 0,
    winner: null,
    moveHistory: [],
    ...overrides,
  };
}

describe('Burn wave 7 — Fab-a-Diffy last-claim win + hard AI', () => {
  it('executeMove claiming the final answer ends the game for the leader', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createFab();
    const barA = findBarId(state, { numerator: 1, denominator: 4 });
    const barB = findBarId(state, { numerator: 3, denominator: 4 });
    const lastAnswer = findAnswerId(state, { numerator: 1, denominator: 1 });

    const answers = new Map(state.answerBars);
    for (const [id, answer] of answers) {
      if (id !== lastAnswer) {
        answers.set(id, { ...answer, claimedBy: 'player1' });
      }
    }
    state = {
      ...state,
      answerBars: answers,
      scores: { player1: 5, player2: 1 },
    };

    state = selectBar1(state, barA);
    state = selectBar2(state, barB);
    state = selectOperation(state, 'add');
    state = executeMove(state, lastAnswer);

    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
    expect(state.answerBars.get(lastAnswer)?.claimedBy).toBe('player1');
  });

  it('hard getAIMove returns a legal step on a fresh deal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const state = createFab();
    const move = getFabAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(state.fractionBars.has(move!.bar1Id)).toBe(true);
    expect(state.fractionBars.has(move!.bar2Id)).toBe(true);
    expect(state.answerBars.has(move!.answerId)).toBe(true);
  });
});

describe('Burn wave 7 — Juggle fill-win via placeShape', () => {
  it('placing a monomino into the last empty cell ends the game', () => {
    const monomino = getShapeById('monomino')!;
    const base = createJuggle();
    const cells = base.boards.player1.cells.map((row, r) =>
      row.map((_c, col) => !(r === 0 && col === 0))
    );
    const state = {
      ...base,
      boards: {
        ...base.boards,
        player1: { ...base.boards.player1, cells },
      },
      phase: 'placing' as const,
      currentDice: [1, 1] as [number, number],
      selectedCategory: 'monomino' as const,
      selectedShape: monomino,
      selectedRotation: 0 as const,
      selectedFlipped: false,
      currentPlayer: 'player1' as const,
    };

    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(true);
    const next = placeShape(state, { row: 0, col: 0 });
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.boards.player1.cells[0][0]).toBe(true);
  });

  it('medium AI die/shape/placement stay legal after a forced roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createJuggle();
    state = {
      ...state,
      phase: 'selectingShape',
      currentDice: [1, 4],
      currentPlayer: 'player1',
    };
    const dieChoice = getAIDieChoice(state, 'player1', 'medium');
    expect(dieChoice).not.toBeNull();
    expect([0, 1]).toContain(dieChoice!.index);

    state = selectDie(state, dieChoice!.index);
    expect(state.selectedCategory).not.toBeNull();

    const shapeChoice = getAIShapeChoice(state, 'player1', 'medium');
    expect(shapeChoice).not.toBeNull();

    const placing = {
      ...state,
      phase: 'placing' as const,
      selectedShape: shapeChoice!.shape,
    };
    const placement = getJugglePlacement(placing, 'player1', 'medium');
    expect(placement).not.toBeNull();
    expect(
      isPlacementValid(
        {
          ...placing,
          selectedRotation: placement!.rotation,
          selectedFlipped: placement!.flipped,
        },
        placement!.position
      )
    ).toBe(true);
  });
});

describe('Burn wave 7 — Hex hard win-in-1', () => {
  it('hard getBestMove takes the immediate connecting stone', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createHex(3),
      board: hexBoard(3, [
        { row: 0, col: 0, player: 'player1' as const },
        { row: 1, col: 0, player: 'player1' as const },
        { row: 0, col: 2, player: 'player2' as const },
      ]),
      currentPlayer: 'player1' as const,
      moveHistory: [
        {
          player: 'player1' as const,
          position: { row: 0, col: 0 },
          moveNumber: 1,
        },
        {
          player: 'player2' as const,
          position: { row: 0, col: 2 },
          moveNumber: 2,
        },
      ],
    };

    const move = getBestMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(
      getValidMoves(state).some(
        (m) => m.row === move!.row && m.col === move!.col
      )
    ).toBe(true);

    const next = makeMove(state, move!);
    expect(next.winner).toBe('player1');
  });
});

describe('Burn wave 7 — Queens stalemate + tiny hard AI', () => {
  it('hasValidMoves is false when current player has no pieces', () => {
    const state = createQueens();
    const cells = new Map(state.cells);
    for (const [key, cell] of cells) {
      cells.set(key, { ...cell, piece: null });
    }
    cells.set(cellKey(5, 0), {
      ...cells.get(cellKey(5, 0))!,
      piece: { type: 'queen', player: 'player2' },
    });
    const stuck = {
      ...state,
      cells,
      currentPlayer: 'player1' as const,
    };
    expect(hasValidMoves(stuck)).toBe(false);
  });

  it('hard getAIMove on a tiny board returns a legal from→to', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = tinyQueensGuard();
    const move = getQueensAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const legal = qgValidMoves(state, move!.from);
    expect(
      legal.some(
        (t) => t.ring === move!.to.ring && t.position === move!.to.position
      )
    ).toBe(true);
    const next = applyAIMove(state, move!);
    expect(next.currentPlayer).toBe('player2');
  });
});

describe('Burn wave 7 — Contig hard AI prefers scored placements', () => {
  it('hard getAIPlacement returns a valid result after roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createContig();
    state = doRollDice(state);
    if (state.phase !== 'calculating' || !state.currentDice) {
      state = {
        ...createContig(),
        phase: 'calculating',
        currentDice: [1, 2, 3],
      };
    }
    const placements = getContigPlacements(state, state.currentDice!);
    if (placements.length === 0) {
      expect(getContigAI(state, 'player1', 'hard')).toBeNull();
      return;
    }
    const move = getContigAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(placements.some((p) => p.result === move!.value)).toBe(true);
    expect(calculatePoints(state, move!.value)).toBeGreaterThanOrEqual(0);
  });

  it('executeAITurn from rolling advances playably', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const next = executeContigAI(createContig(), 'player1', 'hard');
    expect(['rolling', 'calculating', 'gameOver']).toContain(next.phase);
  });
});

describe('Burn wave 7 — Star Track finish + AI choice', () => {
  it('selectChain that reaches TRACK_LENGTH ends the game at 100% progress', () => {
    const state = {
      ...createStar(),
      phase: 'selectChain' as const,
      player1Position: TRACK_LENGTH - 1,
      drawnChains: [
        { id: 901, length: 1 as const },
        { id: 902, length: 2 as const },
      ],
      currentPlayer: 'player1' as const,
    };
    const next = selectChain(state, 0);
    expect(isGameOver(next)).toBe(true);
    expect(next.winner).toBe('player1');
    expect(getProgress(next, 'player1')).toBe(100);
  });

  it('drawChains with empty bucket ends as draw when positions tie', () => {
    const state = {
      ...createStar(),
      phase: 'drawChains' as const,
      chainBucket: [],
      player1Position: 3,
      player2Position: 3,
    };
    const next = drawChains(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('hard getAIChainChoice picks 0 or 1 when chains are drawn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createStar();
    state = drawChains(state);
    expect(state.phase).toBe('selectChain');
    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.chainIndex);
  });
});

describe('Burn wave 7 — Sum Dominoes empty-hand + hard AI', () => {
  it('last-tile placeDomino wins for the emptying player', () => {
    const state = sumBase({
      selectedDomino: 'p1a',
      hands: {
        player1: [makeDomino('p1a', 2, 1)],
        player2: [makeDomino('p2a', 6, 6, 'player2')],
      },
    });
    const placements = getSumPlacements(state, state.hands.player1[0], 8);
    expect(placements.length).toBeGreaterThan(0);
    const { position, orientation } = placements[0];
    const next = placeDomino(state, position, orientation);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('second consecutive pass with tied pips leaves winner null', () => {
    const state = sumBase({
      phase: 'passing',
      passCount: 1,
      currentDice: null,
      hands: {
        player1: [makeDomino('a', 3, 3)],
        player2: [makeDomino('b', 2, 4, 'player2')],
      },
    });
    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('hard getAIMove prefers a playable placement when one exists', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = sumBase({
      currentPlayer: 'player2',
      selectedDomino: null,
      hands: {
        player1: [makeDomino('p1', 1, 1)],
        player2: [
          makeDomino('p2', 2, 1, 'player2'),
          makeDomino('p2b', 6, 6, 'player2'),
        ],
      },
    });
    expect(hasPlayableMove(state, 'player2', 8)).toBe(true);
    const move = getSumAI(state, 'player2', 'hard');
    expect(move).not.toBeNull();
    expect(move!.dominoId).toBeTruthy();
  });
});

describe('Burn wave 7 — Par / Calla AI deepenings', () => {
  it('hard Par getAIMove returns a legal block/base on a fresh deal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createPar();
    const move = getParAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(state.hands.player1.some((b) => b.id === move!.blockId)).toBe(true);
    expect(state.bases.has(move!.baseId)).toBe(true);
    expect(PAR_CFG.TARGET_SCORE).toBeGreaterThan(0);
  });

  it('medium Calla getAIMove picks a valid pit; analyzeMoves lists options', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createCalla();
    const valid = getValidPits(state);
    expect(valid.length).toBeGreaterThan(0);
    const analysis = analyzeMoves(state, 'player1');
    expect(analysis.length).toBe(valid.length);
    const move = getCallaAI(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(valid).toContain(move!.pit);
  });
});
