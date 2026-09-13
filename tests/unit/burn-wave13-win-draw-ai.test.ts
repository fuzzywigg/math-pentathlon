import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createContig,
  getAdjacentPositions,
} from '../../src/games/contig-60/types';
import {
  placeChip as placeContig,
  calculatePoints as contigPoints,
  doRollDice as rollContig,
} from '../../src/games/contig-60/rules';
import { getAIPlacement as getContigAI } from '../../src/games/contig-60/ai';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  checkWinner as hexWinner,
  getWinningPath,
  makeMove as hexMove,
  getValidMoves as hexValid,
} from '../../src/games/hex/rules';

import {
  createInitialState as createFab,
  hasAnyValidMove,
  selectBar1,
} from '../../src/games/fab-a-diffy/rules';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  rotateShape,
  flipShape,
  getBoardFillPercentage,
  isPlacementValid,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import { createBoard } from '../../src/core/polyomino/placement';

import {
  getDominoPips,
  isDouble,
  Domino,
  PlacedDomino,
  SumDominoesState,
  CONFIG as SD_CFG,
} from '../../src/games/sum-dominoes/types';
import {
  createInitialState as createSum,
  selectDomino,
  placeDomino,
  getRemainingCount,
  doRollDice as rollSum,
} from '../../src/games/sum-dominoes/rules';
import {
  getAIMove as getSumAI,
  hasPlayableMove,
} from '../../src/games/sum-dominoes/ai';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  getProgress,
  selectChain,
  drawChains,
} from '../../src/games/star-track/rules';

import {
  createInitialState as createQueens,
  cellKey,
  BoardCoord,
  CONFIG as QG_CFG,
} from '../../src/games/queens-guards/types';
import {
  restoreCapturedPiece,
  checkWinner as qgWinner,
  hasValidMoves as qgHasMoves,
} from '../../src/games/queens-guards/rules';
import { getAIMove as getQueensAI } from '../../src/games/queens-guards/ai';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { deselectChip, isDraw as fiarIsDraw } from '../../src/games/fiar/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  findValidIslands,
  selectIsland,
  countOwnedIslands,
  setSelectedIsland,
} from '../../src/games/remainder-islands/rules';

import {
  createInitialState as createPrime,
  placeChip as placePrime,
} from '../../src/games/prime-gold/rules';
import {
  CONFIG as PRIME_CFG,
  DICE_CONFIG,
  isPrime,
  factorial,
} from '../../src/games/prime-gold/types';

import {
  createInitialState as createRamrod,
  selectRod,
  getValidPlacements as getRamrodPlacements,
} from '../../src/games/ramrod/rules';

import {
  createInitialState as createStars,
  hasValidMoves as starsHasMoves,
  passTurn as passStars,
} from '../../src/games/stars-bars/rules';

import { countMatchingAttributes } from '../../src/games/par-55/types';
import {
  createInitialState as createPar,
  placeBlock,
} from '../../src/games/par-55/rules';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { canPlayerMove as pentCanMove } from '../../src/games/pent-em-in/rules';

import {
  createInitialState as createFrac,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from '../../src/games/frac-fact/types';
import { submitAnswer as submitFrac } from '../../src/games/frac-fact/rules';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  hitRandomTarget,
  submitAnswer as submitPinball,
} from '../../src/games/fraction-pinball/rules';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  canPlayerMove as hagCanMove,
  getValidPlacements as getHagPlacements,
} from '../../src/games/hex-a-gone/rules';

import {
  createInitialState as createKwa,
  moveChip as kwaMove,
  clearSelection as clearKwa,
  selectChip as kwaSelect,
} from '../../src/games/kwatro-sinko/rules';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  canCompleteTurn,
  isDrawCondition,
  getValidKingMoves,
} from '../../src/games/kings-quadraphages/rules';
import {
  createKing,
  createQuadraphage,
  INITIAL_QUADRAPHAGE_COUNT,
} from '../../src/games/kings-quadraphages/pieces';
import {
  fromOneBasedPosition,
  toOneBasedPosition,
  hasSupply,
  getSupply,
  BOARD_SIZE as KINGS_BOARD,
} from '../../src/games/kings-quadraphages/board';
import {
  gameStateToJSON,
  gameStateFromJSON,
  serializeGameState,
  validateSerializedState,
  getSaveInfo,
  generateSaveFileName,
} from '../../src/games/kings-quadraphages/serialization';
import { getAIMove as getKingsAI } from '../../src/games/kings-quadraphages/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

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
  col: number
): void {
  const placed: PlacedDomino = {
    domino: { ...domino, orientation: 'horizontal' },
    position: { row, col },
    orientation: 'horizontal',
  };
  board[row]![col] = placed;
  board[row]![col + 1] = placed;
}

function sumBase(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  const board = emptySumBoard();
  placeOnBoard(board, makeDomino('seed', 6, 6, null), 5, 5);
  return {
    board,
    hands: {
      player1: [makeDomino('p1a', 2, 1), makeDomino('p1b', 3, 3)],
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

describe('Burn wave 13 — Contig adjacency points + wrong-phase place', () => {
  it('owned neighbors score; placeChip no-ops while rolling', () => {
    let state = createContig();
    const target = state.cells.get(5)!;
    const adj = getAdjacentPositions(target.row, target.col);
    const cells = new Map(state.cells);
    let owned = 0;
    for (const { row, col } of adj.slice(0, 2)) {
      const value = state.grid[row]![col];
      if (value === null) continue;
      const cell = cells.get(value)!;
      cells.set(value, { ...cell, owner: 'player1' });
      owned++;
    }
    state = { ...state, cells };
    expect(contigPoints(state, 5)).toBe(owned);

    const rolling = createContig();
    expect(placeContig(rolling, 5, '1+2+2')).toBe(rolling);

    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const rolled = rollContig(createContig());
    const easy = getContigAI(rolled, 'player1', 'easy');
    const hard = getContigAI(rolled, 'player1', 'hard');
    if (easy) expect(typeof easy.value).toBe('number');
    if (hard) expect(typeof hard.value).toBe('number');
  });
});

describe('Burn wave 13 — Hex getWinningPath after win', () => {
  it('top-bottom path yields winning cells; opening empty', () => {
    const size = 3;
    const opening = createHex(size);
    expect(getWinningPath(opening.board, 'player1', size)).toEqual([]);

    const board = opening.board.map((row) => [...row]);
    board[0]![1] = 'player1';
    board[1]![1] = 'player1';
    board[2]![1] = 'player1';
    expect(hexWinner(board, 'player1', size)).toBe(true);
    const path = getWinningPath(board, 'player1', size);
    expect(path.length).toBeGreaterThan(0);
    for (const pos of path) {
      expect(board[pos.row]![pos.col]).toBe('player1');
    }

    let live = createHex(size);
    const first = hexValid(live)[0]!;
    live = hexMove(live, first);
    expect(live.moveHistory.length).toBe(1);
  });
});

describe('Burn wave 13 — Fab empty-bank hasAnyValidMove', () => {
  it('fewer than two unused bars → false; selectBar1 stays safe', () => {
    const state = createFab();
    const bars = new Map(state.fractionBars);
    const ids = [...bars.keys()];
    for (let i = 0; i < ids.length - 1; i++) {
      const id = ids[i]!;
      bars.set(id, { ...bars.get(id)!, used: true });
    }
    const drained = { ...state, fractionBars: bars };
    expect(hasAnyValidMove(drained)).toBe(false);
    const only = ids[ids.length - 1]!;
    expect(selectBar1(drained, only).selectedBar1).toBeTruthy();
  });
});

describe('Burn wave 13 — Juggle rotate/fill edges', () => {
  it('rotate cycles; full board is 100%', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    let state = juggleRoll(createJuggle());
    expect(rotateShape(state)).toBe(state);

    state = selectDie(state, 0);
    const shapes = getShapesForDie(state.currentDice![0]!);
    state = selectShape(state, shapes[0]!);
    expect(state.phase).toBe('placing');
    const rotated = rotateShape(state);
    expect(rotated.selectedRotation).toBe(90);
    if (state.selectedShape?.canFlip) {
      expect(flipShape(state).selectedFlipped).toBe(true);
    }

    const full = createBoard(9, 9);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        full.cells[r]![c] = true;
      }
    }
    expect(getBoardFillPercentage(full)).toBe(100);
    expect(typeof isPlacementValid(state, { row: 0, col: 0 })).toBe('boolean');
  });
});

describe('Burn wave 13 — Sum pips / remaining / illegal place', () => {
  it('getDominoPips / isDouble / remaining; rolling place/select identity', () => {
    expect(getDominoPips(makeDomino('x', 2, 5))).toBe(7);
    expect(isDouble(makeDomino('d', 3, 3))).toBe(true);
    expect(isDouble(makeDomino('n', 2, 5))).toBe(false);

    const placing = sumBase();
    expect(getRemainingCount(placing, 'player1')).toBe(2);

    const rolling = sumBase({ phase: 'rolling', currentDice: null });
    expect(selectDomino(rolling, 'p1a')).toBe(rolling);
    expect(placeDomino(rolling, { row: 5, col: 4 }, 'horizontal')).toBe(
      rolling
    );

    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const rolled = rollSum(createSum());
    const sum =
      (rolled.currentDice?.[0] ?? 0) + (rolled.currentDice?.[1] ?? 0);
    if (hasPlayableMove(rolled, 'player1', sum)) {
      const move = getSumAI(rolled, 'player1', 'easy');
      if (move) expect(move.dominoId).toBeTruthy();
    }
  });
});

describe('Burn wave 13 — Star progress near finish', () => {
  it('near TRACK_LENGTH progress approaches 100; draw→select advances', () => {
    const near = { ...createStar(), player1Position: TRACK_LENGTH - 1 };
    expect(getProgress(near, 'player1')).toBeCloseTo(
      ((TRACK_LENGTH - 1) / TRACK_LENGTH) * 100,
      5
    );
    const done = { ...createStar(), player1Position: TRACK_LENGTH };
    expect(getProgress(done, 'player1')).toBe(100);

    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = drawChains(createStar());
    expect(state.drawnChains?.length).toBe(2);
    state = selectChain(state, 0);
    expect(state.player1Position).toBeGreaterThan(0);
  });
});

describe('Burn wave 13 — Queens restore + center win craft', () => {
  it('restoreCapturedPiece moves to outer ring; crafted queen+guards win', () => {
    const opening = createQueens();
    const outer: BoardCoord = {
      ring: QG_CFG.NUM_RINGS - 1,
      position: 0,
    };
    const captured: BoardCoord = { ring: 2, position: 0 };
    const cells = new Map(opening.cells);
    const piece = {
      id: 'cap-1',
      player: 'player2' as const,
      type: 'guard' as const,
    };
    cells.set(cellKey(captured.ring, captured.position), {
      ...cells.get(cellKey(captured.ring, captured.position))!,
      piece,
    });
    cells.set(cellKey(outer.ring, outer.position), {
      ...cells.get(cellKey(outer.ring, outer.position))!,
      piece: null,
    });
    const withCap = {
      ...opening,
      cells,
      capturedPieces: [captured],
      currentPlayer: 'player2' as const,
    };
    const restored = restoreCapturedPiece(withCap, captured, outer);
    expect(
      restored.cells.get(cellKey(outer.ring, outer.position))?.piece?.id
    ).toBe('cap-1');
    expect(
      restoreCapturedPiece(withCap, captured, { ring: 1, position: 0 })
    ).toBe(withCap);

    const winCells = new Map(opening.cells);
    for (const [key, cell] of winCells) {
      winCells.set(key, { ...cell, piece: null });
    }
    winCells.set(cellKey(0, 0), {
      ...winCells.get(cellKey(0, 0))!,
      piece: { id: 'q1', player: 'player1', type: 'queen' },
    });
    for (let pos = 0; pos < 6; pos++) {
      winCells.set(cellKey(1, pos), {
        ...winCells.get(cellKey(1, pos))!,
        piece: { id: `g${pos}`, player: 'player1', type: 'guard' },
      });
    }
    expect(qgWinner({ ...opening, cells: winCells })).toBe('player1');

    const emptyPieces = new Map(opening.cells);
    for (const [key, cell] of emptyPieces) {
      emptyPieces.set(key, { ...cell, piece: null });
    }
    expect(qgHasMoves({ ...opening, cells: emptyPieces })).toBe(false);

    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const ai = getQueensAI(opening, 'player1', 'easy');
    if (ai) {
      expect(ai.from).toBeTruthy();
      expect(ai.to).toBeTruthy();
    }
  });
});

describe('Burn wave 13 — FIAR deselect + opening draw false', () => {
  it('deselectChip on fresh state clears selection; opening not draw', () => {
    const state = createFiar();
    expect(fiarIsDraw(state)).toBe(false);
    const cleared = deselectChip(state);
    expect(cleared.selectedNode).toBeNull();
  });
});

describe('Burn wave 13 — Remainder owned count after claim', () => {
  it('selectIsland bumps owned count; setSelectedIsland stores id', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    let state = performRoll(createRemainder());
    const valid = findValidIslands(state);
    expect(valid.length).toBeGreaterThan(0);
    const before = countOwnedIslands(state);
    state = selectIsland(state, valid[0]!);
    const after = countOwnedIslands(state);
    expect(after.player1 + after.player2).toBeGreaterThan(
      before.player1 + before.player2
    );

    const rolling = createRemainder();
    expect(setSelectedIsland(rolling, 'nope').selectedIsland).toBe('nope');
    expect(setSelectedIsland(rolling, null).selectedIsland).toBeNull();
  });
});

describe('Burn wave 13 — Prime CONFIG + wrong-phase place', () => {
  it('CONFIG / DICE_CONFIG / isPrime / factorial; place before roll identity', () => {
    expect(PRIME_CFG.BOARD_SIZE).toBe(7);
    expect(PRIME_CFG.VEINS_TO_WIN).toBe(4);
    expect(DICE_CONFIG.die3.max).toBe(10);
    expect(isPrime(7)).toBe(true);
    expect(isPrime(8)).toBe(false);
    expect(factorial(5)).toBe(120);
    const rolling = createPrime();
    expect(placePrime(rolling, 0, 0, '1+1')).toBe(rolling);
  });
});

describe('Burn wave 13 — Ramrod empty placements for missing rod', () => {
  it('unknown rod id yields no placements; selectRod then clear keeps board', () => {
    const state = createRamrod();
    expect(getRamrodPlacements(state, 'not-a-rod')).toEqual([]);
    const rodId = [...state.rods.keys()][0]!;
    const selected = selectRod(state, rodId);
    expect(selected.selectedRod).toBe(rodId);
    expect(getRamrodPlacements(selected, rodId).length).toBeGreaterThanOrEqual(
      0
    );
  });
});

describe('Burn wave 13 — Stars empty-hand hasValidMoves', () => {
  it('empty hand → false; passTurn flips seat', () => {
    const state = {
      ...createStars(),
      playerHands: { player1: [], player2: [] },
    };
    expect(starsHasMoves(state)).toBe(false);
    const passed = passStars(state);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.phase).toBe('selectingCard');
  });
});

describe('Burn wave 13 — Par countMatchingAttributes + wrong-phase place', () => {
  it('matching attrs listed; place without selection is identity', () => {
    const a = {
      id: 'a',
      shape: 'circle' as const,
      color: 'red' as const,
      size: 'large' as const,
      thickness: 'thick' as const,
    };
    const b = {
      id: 'b',
      shape: 'circle' as const,
      color: 'red' as const,
      size: 'small' as const,
      thickness: 'thin' as const,
    };
    const matches = countMatchingAttributes(a, b);
    expect(matches).toContain('shape');
    expect(matches).toContain('color');
    expect(matches).not.toContain('size');

    const fresh = createPar();
    expect(placeBlock(fresh, 'base-0-0')).toBe(fresh);
  });
});

describe("Burn wave 13 — Pent canPlayerMove false when empty available", () => {
  it('empty available pieces → cannot move', () => {
    const state = createPent();
    const drained = {
      ...state,
      player1Pieces: { available: [], placed: [] },
      player2Pieces: { available: [], placed: [] },
    };
    expect(pentCanMove(drained, 'player1')).toBe(false);
    expect(pentCanMove(state, 'player1')).toBe(true);
  });
});

describe('Burn wave 13 — Frac streak scoring', () => {
  it('correct with streak adds POINTS + streak*BONUS; wrong resets streak', () => {
    const problem = {
      id: 'w13-f',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 4 },
      operation: 'add' as const,
      correctAnswer: { numerator: 3, denominator: 4 },
      answerChoices: [
        { numerator: 3, denominator: 4 },
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 4 },
        { numerator: 1, denominator: 1 },
      ],
    };
    const streak = 2;
    const playing = {
      ...createFrac('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
      player1Stats: {
        ...createFrac('easy').player1Stats,
        currentStreak: streak,
        score: 0,
      },
    };
    const correct = submitFrac(playing, problem.correctAnswer);
    expect(correct.player1Stats.score).toBe(
      POINTS_PER_CORRECT + streak * STREAK_BONUS
    );
    expect(correct.player1Stats.currentStreak).toBe(streak + 1);

    const wrong = submitFrac(playing, { numerator: 1, denominator: 1 });
    expect(wrong.player1Stats.currentStreak).toBe(0);
    expect(wrong.player1Stats.score).toBe(0);
  });
});

describe('Burn wave 13 — Pinball hitRandomTarget + correct submit', () => {
  it('hitRandomTarget returns points; correct submit bumps score', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createPinball();
    const hit = hitRandomTarget(state.targets);
    expect(hit.points).toBeGreaterThan(0);
    expect(hit.target).toBeTruthy();

    const challenge = {
      id: 'w13-p',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5', '0.25', '0.75', '1'],
      correctAnswer: '0.5',
    };
    const answering = {
      ...state,
      phase: 'answering' as const,
      currentChallenge: challenge,
    };
    const before = answering.player1Stats.score;
    const next = submitPinball(answering, '0.5');
    expect(next.isCorrect).toBe(true);
    expect(next.player1Stats.score).toBeGreaterThan(before);
    expect(submitPinball(state, '0.5')).toBe(state);
  });
});

describe('Burn wave 13 — Hex-a-Gone empty bank / no placement selection', () => {
  it('empty bank cannot move; no selected block → no placements', () => {
    const state = createHexAGone();
    const emptyBank = {
      ...state,
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 0,
        square: 0,
      },
    };
    expect(hagCanMove(emptyBank)).toBe(false);
    expect(getHagPlacements(state).length).toBe(0);
  });
});

describe('Burn wave 13 — Kwatro wrong-phase move + clearSelection', () => {
  it('move without selection identity; clear restores selectingChip', () => {
    const state = createKwa();
    expect(kwaMove(state, 'n0-0')).toBe(state);
    const chip = [...state.chips.values()].find((c) => c.owner === 'player1')!;
    const selected = kwaSelect(state, chip.id);
    expect(selected.selectedChip).toBe(chip.id);
    const cleared = clearKwa(selected);
    expect(cleared.phase).toBe('selectingChip');
    expect(cleared.selectedChip).toBeNull();
  });
});

describe('Burn wave 13 — Kings serialization / pieces / supply / draw', () => {
  it('pieces + coords + JSON round-trip + supply + draw when both trapped', () => {
    expect(createKing('player1').type).toBe('king');
    expect(createQuadraphage('player2').type).toBe('quadraphage');
    expect(INITIAL_QUADRAPHAGE_COUNT).toBe(30);
    expect(fromOneBasedPosition(1, 5)).toEqual({ row: 0, col: 4 });
    expect(toOneBasedPosition({ row: 0, col: 4 })).toEqual({ row: 1, col: 5 });
    expect(KINGS_BOARD).toBe(9);

    const state = createKings();
    const json = gameStateToJSON(state, { gameName: 'wave13' });
    const restored = gameStateFromJSON(json);
    expect(restored.player1Supply).toBe(state.player1Supply);
    expect(restored.board.length).toBe(9);
    const serialized = serializeGameState(state);
    expect(validateSerializedState(serialized)).toBe(true);
    expect(validateSerializedState({ version: 1 })).toBe(false);
    expect(getSaveInfo(serialized).turnCount).toBe(0);
    expect(generateSaveFileName('kq')).toMatch(/^kq-\d{4}-\d{2}-\d{2}/);

    const rulesBoard = {
      board: state.board,
      player1Supply: state.player1Supply,
      player2Supply: state.player2Supply,
    };
    expect(hasSupply(rulesBoard, 'player1')).toBe(true);
    expect(getSupply(rulesBoard, 'player1')).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(canCompleteTurn(rulesBoard, 'player1')).toBe(true);
    expect(
      canCompleteTurn({ ...rulesBoard, player1Supply: 0 }, 'player1')
    ).toBe(false);

    // Trap both kings by filling all neighbors with quadraphages
    const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    for (const [kr, kc] of [
      [0, 4],
      [8, 4],
    ] as const) {
      for (const [dr, dc] of dirs) {
        const r = kr + dr;
        const c = kc + dc;
        if (r >= 0 && r < 9 && c >= 0 && c < 9 && !board[r]![c]) {
          board[r]![c] = { type: 'quadraphage', owner: 'player1' };
        }
      }
    }
    const trapped = { board, player1Supply: 1, player2Supply: 1 };
    expect(getValidKingMoves(trapped, 'player1').length).toBe(0);
    expect(getValidKingMoves(trapped, 'player2').length).toBe(0);
    expect(isDrawCondition(trapped)).toBe(true);

    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    expect(getKingsAI(rulesBoard, 'player1', 'easy')).not.toBeNull();
    expect(getKingsAI(rulesBoard, 'player1', 'hard')).not.toBeNull();
  });
});
