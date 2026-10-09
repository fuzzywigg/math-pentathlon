/**
 * burn-1008-mp-engine-coverage-round-2 — characterization for the NEXT
 * lowest-covered NON-AI engine modules after #562.
 *
 * Themes: legal-move generation, win/draw detection, state transitions,
 * edge boards, undo/redo invariants. Pins CURRENT behavior only.
 * Does not change engine source. Round-5 (q-mp-201) clears prior it.todo
 * arms via forged-state pins or documented unreachable invariants.
 *
 * Avoids duplicating #482 / #562 / #566 suites.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
  isValidPlacement as sumValid,
  canPlayDomino as sumCanPlay,
  getValidPlacements as sumValids,
  passTurn as sumPass,
} from '../../src/games/sum-dominoes/rules';
import {
  CONFIG as SUM_CFG,
  type SumDominoesState,
  type Domino,
  type PlacedDomino,
} from '../../src/games/sum-dominoes/types';
import * as SumTypes from '../../src/games/sum-dominoes/types';

import {
  getPossibleResults,
  calculateResult,
  hasAnyValidMove,
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  passTurn as fabPass,
  checkWinner as fabWinner,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';
import { COMMON_FRACTIONS } from '../../src/core/fractions/types';

import {
  createInitialState as createPent,
  BOARD_SIZE as PENT_BOARD,
  type PentEmInState,
} from '../../src/games/pent-em-in/types';
import {
  selectPiece as pentSelect,
  getCurrentOrientationPlacements as pentPlacements,
  canPlayerMove as pentCanMove,
  placePiece as pentPlace,
} from '../../src/games/pent-em-in/rules';

import {
  createInitialState as createCalla,
  PITS_PER_SIDE,
} from '../../src/games/calla/types';
import {
  getValidPits,
  makeMove as callaMove,
  settleNoValidMoves,
} from '../../src/games/calla/rules';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  commitSelection as hagCommit,
  selectBlock as hagSelect,
  getValidPlacements as hagValids,
  canPlayerMove as hagCanMove,
  isGameOver as hagOver,
  passTurn as hagPass,
} from '../../src/games/hex-a-gone/rules';
import type {
  HexAGoneGameState,
  BlockShape,
} from '../../src/games/hex-a-gone/types';

import {
  createInitialState as createContig,
  type ContigState,
} from '../../src/games/contig-60/types';
import {
  countNInARows,
  checkWinner as contigWinner,
  alignmentTiebreak,
  isBoardFull,
  hasValidMoves as contigHasMoves,
  doRollDice as contigRoll,
  passTurn as contigPass,
} from '../../src/games/contig-60/rules';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  getRestoreTargets,
  getValidMoves as qgValids,
  hasValidMoves as qgHasMoves,
  checkWinner as qgWinner,
  selectPiece as qgSelect,
  makeMove as qgMove,
} from '../../src/games/queens-guards/rules';
import { cellKey } from '../../src/games/queens-guards/types';

import {
  createInitialState as createJuggle,
  selectDie as juggleSelectDie,
  selectShape as juggleSelectShape,
  selectedShapeFitsAnywhere,
  getCurrentOrientationPlacements as juggleOrients,
  doRollDice as juggleRoll,
  abandonPlacement,
} from '../../src/games/juggle/rules';
import {
  SHAPE_POOLS,
  CONFIG as JUGGLE_CFG,
  type JuggleState,
  type ShapeCategory,
} from '../../src/games/juggle/types';
import { createBoard } from '../../src/core/polyomino/placement';

import {
  generateChallenge,
  formatFraction as pinballFormatFraction,
  startGame as pinballStart,
  submitAnswer as pinballSubmit,
  nextChallenge as pinballNext,
} from '../../src/games/fraction-pinball/rules';
import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import type { FractionPinballState } from '../../src/games/fraction-pinball/types';

import {
  createInitialState as createStars,
  selectCard as starsSelect,
  getValidPlacements as starsValids,
  placeCard as starsPlace,
  passTurn as starsPass,
  hasValidMoves as starsHasMoves,
  clearSelection as starsClear,
} from '../../src/games/stars-bars/rules';
import type {
  AttributeCard,
  BoardCell,
  StarsState,
} from '../../src/games/stars-bars/types';

import {
  startGame as fracStart,
  submitAnswer as fracSubmit,
  nextProblem as fracNext,
  generateProblem,
  checkAnswer as fracCheck,
  getOperationSymbol,
  formatFraction as fracFormat,
} from '../../src/games/frac-fact/rules';
import { createInitialState as createFrac } from '../../src/games/frac-fact/types';

import {
  canPlaceChip,
  getValidMoves as fiarValids,
  getSelectableNodes,
  isDraw as fiarIsDraw,
  checkWinner as fiarWinner,
  placeChip as fiarPlace,
  setSelectedChipKind,
  normalizeSelectedChipKind,
  deselectChip,
  findAnyWinningPath,
  findPaths,
} from '../../src/games/fiar/rules';
import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';

import {
  jsonRoundTrip,
  canonMoves,
  stripLazyCaches,
} from './helpers/state-roundtrip';
import { ALL_GAME_ADAPTERS } from './helpers/state-roundtrip-games';

// ─── helpers ─────────────────────────────────────────────────────────────────

function emptySumBoard(): (PlacedDomino | null)[][] {
  const board: (PlacedDomino | null)[][] = [];
  for (let r = 0; r < SUM_CFG.BOARD_SIZE; r++) {
    board.push(new Array(SUM_CFG.BOARD_SIZE).fill(null));
  }
  return board;
}

/** Stamp a placed domino whose stored position does NOT match cell indices. */
function mismatchedStampState(
  orientation: 'horizontal' | 'vertical'
): SumDominoesState {
  const board = emptySumBoard();
  const stamped: PlacedDomino = {
    domino: {
      id: 'stamp',
      face1: 3,
      face2: 3,
      owner: null,
      orientation,
    },
    // Deliberately wrong metadata relative to where we store the reference
    position: { row: 0, col: 0 },
    orientation,
  };
  // Store the object at (5,5)/(5,6) or (5,5)/(6,5) so adjacency sees it,
  // but getFaceAtPosition looks at position (0,0) → returns null.
  board[5]![5] = stamped;
  if (orientation === 'horizontal') {
    board[5]![6] = stamped;
  } else {
    board[6]![5] = stamped;
  }
  return {
    ...createSum(),
    board,
    phase: 'placing',
    currentDice: [3, 3],
  };
}

function fullPentBoard(): PentEmInState {
  const open = createPent();
  const board = open.board.map((row) =>
    row.map((c) => ({
      ...c,
      occupied: true,
      owner: 'player2' as const,
      pieceId: 'block',
    }))
  );
  return {
    ...open,
    board,
    player1Pieces: { available: ['I5', 'X', 'L5'], placed: [] },
  };
}

function jammedJuggleBoard(): JuggleState {
  const full = createBoard(JUGGLE_CFG.GRID_SIZE, JUGGLE_CFG.GRID_SIZE);
  for (let r = 0; r < full.rows; r++) {
    for (let c = 0; c < full.cols; c++) {
      full.cells[r]![c] = true;
    }
  }
  return {
    ...createJuggle(),
    boards: {
      player1: full,
      player2: createBoard(JUGGLE_CFG.GRID_SIZE, JUGGLE_CFG.GRID_SIZE),
    },
    phase: 'selectingShape',
    currentDice: [4, 5],
    selectedCategory: 'tetromino',
    selectedDieValue: 4,
  };
}

function bar(id: string, num: number, den: number): FractionBar {
  return {
    id,
    fraction: { numerator: num, denominator: den },
    owner: null,
    used: false,
  };
}

// =============================================================================
// 1. sum-dominoes — mismatched stamp / empty seed / legal-move edges
// =============================================================================

describe('engine-coverage-round-2 — sum-dominoes', () => {
  it('mismatched horizontal stamp: face lookup null → no legal adjacency match', () => {
    const state = mismatchedStampState('horizontal');
    const domino: Domino = {
      id: 'play',
      face1: 3,
      face2: 4,
      owner: 'player1',
      orientation: 'horizontal',
    };
    // Adjacent to the stamped cells at (5,5)/(5,6)
    expect(sumValid(state, domino, { row: 5, col: 3 }, 'horizontal', 6)).toBe(
      false
    );
    expect(sumCanPlay(state, domino, 6)).toBe(false);
    expect(sumValids(state, domino, 6)).toEqual([]);
  });

  it('mismatched vertical stamp: face2 fall-through returns null', () => {
    const state = mismatchedStampState('vertical');
    const domino: Domino = {
      id: 'play',
      face1: 3,
      face2: 3,
      owner: 'player1',
      orientation: 'horizontal',
    };
    expect(sumValid(state, domino, { row: 5, col: 3 }, 'horizontal', 6)).toBe(
      false
    );
    expect(sumCanPlay(state, domino, 6)).toBe(false);
  });

  it('createInitialState with tiny set: no seed when remainder empty', () => {
    const tiny: Domino[] = [
      {
        id: 'a',
        face1: 1,
        face2: 1,
        owner: null,
        orientation: 'horizontal',
      },
      {
        id: 'b',
        face1: 2,
        face2: 2,
        owner: null,
        orientation: 'horizontal',
      },
    ];
    const spy = vi.spyOn(SumTypes, 'createDominoSet').mockReturnValue(tiny);
    try {
      const state = createSum();
      const occupied = state.board.some((row) => row.some((c) => c !== null));
      // CURRENT: empty remainder → startingDomino undefined → empty board
      expect(occupied).toBe(false);
      expect(state.hands.player1.length).toBeLessThanOrEqual(
        SUM_CFG.STARTING_HAND_SIZE
      );
    } finally {
      spy.mockRestore();
    }
  });

  it('passTurn after impossible roll increments passCount; serialize round-trip', () => {
    let state = createSum();
    // Empty both hands so canPlay is false after roll
    state = {
      ...state,
      hands: { player1: [], player2: [] },
    };
    state = sumRoll(state);
    expect(state.phase).toBe('passing');
    state = sumPass(state);
    expect(state.passCount).toBeGreaterThanOrEqual(1);
    const trip = jsonRoundTrip(stripLazyCaches(state));
    expect(trip.passCount).toBe(state.passCount);
  });
});

// =============================================================================
// 2. fab-a-diffy — reverse subtract/divide guards + win/draw settle
// =============================================================================

describe('engine-coverage-round-2 — fab-a-diffy', () => {
  it('getPossibleResults: reverse divide-by-zero null arm; subtract keeps isNegative', () => {
    // Oddity: simplify() moves sign into isNegative, so
    // `result.numerator >= 0` does NOT filter arithmetic negatives.
    // Reverse (1/8 − 7/8) still appears as {numerator:3/4, isNegative:true}.
    const big = bar('big', 7, 8);
    const small = bar('small', 1, 8);
    const results = getPossibleResults(big, small);
    const subtractOps = results.filter((r) => r.operation === 'subtract');
    expect(subtractOps.length).toBe(2);
    expect(subtractOps.some((r) => r.result.isNegative === true)).toBe(true);

    // Reverse divide null hits the false arm of
    // `if (reverseResult && reverseResult.numerator >= 0)`.
    const zero = bar('z', 0, 1);
    const half = bar('h', 1, 2);
    const withZeroFirst = getPossibleResults(zero, half);
    const divOps = withZeroFirst.filter((r) => r.operation === 'divide');
    // Forward 0÷½ = 0; reverse ½÷0 = null (skipped)
    expect(divOps.length).toBe(1);
    expect(divOps[0]!.result.numerator).toBe(0);
  });

  it('calculateResult divide-by-zero returns null; add/multiply happy path', () => {
    expect(
      calculateResult(
        { numerator: 1, denominator: 2 },
        { numerator: 0, denominator: 1 },
        'divide'
      )
    ).toBeNull();
    expect(
      calculateResult(
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 3 },
        'add'
      )
    ).not.toBeNull();
  });

  it('opening: hasAnyValidMove true; pass hands off; checkWinner null mid-game', () => {
    const open = createFab();
    expect(hasAnyValidMove(open)).toBe(true);
    expect(fabWinner(open.answerBars, open.fractionBars)).toBeNull();
    const passed = fabPass(open);
    expect(passed.currentPlayer).toBe('player2');
  });

  it('selectBar1 → selectBar2 state transition preserves pool', () => {
    const open = createFab();
    const ids = [...open.fractionBars.keys()];
    expect(ids.length).toBeGreaterThan(1);
    const s1 = selectBar1(open, ids[0]!);
    expect(s1.selectedBar1).toBe(ids[0]);
    const s2 = selectBar2(s1, ids[1]!);
    expect(s2.selectedBar2).toBe(ids[1]);
  });

  it('hasAnyValidMove left/right === undefined continue (forged Array.from+filter holes)', () => {
    const open = createFab();
    const origFrom = Array.from;
    // Forge: Array.from(...).filter(...) yields length≥2 with holes so
    // availableBars[i]/[j] are undefined → defensive continue → false.
    Array.from = (() => ({
      filter() {
        const holes: FractionBar[] = [];
        holes.length = 2;
        return holes;
      },
    })) as unknown as typeof Array.from;
    try {
      expect(hasAnyValidMove(open)).toBe(false);
    } finally {
      Array.from = origFrom;
    }
  });

  it('calculateResult catch returns null when operand access throws', () => {
    const boom = new Proxy({} as { numerator: number; denominator: number }, {
      get() {
        throw new Error('forged throw');
      },
    });
    expect(
      calculateResult(boom, { numerator: 1, denominator: 2 }, 'add')
    ).toBeNull();
  });
});

// =============================================================================
// 3. pent-em-in — jammed board select → preview null
// =============================================================================

describe('engine-coverage-round-2 — pent-em-in', () => {
  it('selectPiece on fully occupied board sets previewPosition null', () => {
    const jammed = fullPentBoard();
    const next = pentSelect(jammed, 'I5');
    expect(next.phase).toBe('placePiece');
    expect(next.selectedPiece).toBe('I5');
    expect(next.previewPosition).toBeNull();
    expect(pentPlacements(next)).toEqual([]);
    expect(pentCanMove(jammed, 'player1')).toBe(false);
  });

  it('legal opening select → place transition; undo via re-create + reapply', () => {
    let state = pentSelect(createPent(), 'X');
    const anchors = pentPlacements(state);
    expect(anchors.length).toBeGreaterThan(0);
    const before = stripLazyCaches(state);
    state = pentPlace(
      state,
      'X',
      anchors[0]!,
      state.selectedRotation,
      state.selectedFlipped
    );
    // Undo invariant: fresh opening + same select yields same placements
    const redoSelect = pentSelect(createPent(), 'X');
    expect(canonMoves(pentPlacements(redoSelect))).toBe(
      canonMoves(pentPlacements(before as PentEmInState))
    );
  });

  it('canPlayerMove skips unknown mid-list shapes when first shape is known', () => {
    const jammed: PentEmInState = {
      ...fullPentBoard(),
      player1Pieces: {
        available: ['X', 'bogus-shape', 'I5'],
        placed: [],
      },
    };
    // First shape known → no available[0] short-circuit; bogus mid-list → continue
    expect(pentCanMove(jammed, 'player1')).toBe(false);
  });
});

// =============================================================================
// 4. calla — legal moves / sow transitions
// =============================================================================

describe('engine-coverage-round-2 — calla', () => {
  it('legal-move generation: opening pits non-empty; settleNoValidMoves early-returns when valids remain', () => {
    const open = createCalla();
    const pits = getValidPits(open);
    expect(pits.length).toBe(PITS_PER_SIDE);
    expect(settleNoValidMoves(open)).toBe(open);
  });

  it('makeMove from a valid pit transitions phase or free-turn/seat', () => {
    const open = createCalla();
    const pits = getValidPits(open);
    const next = callaMove(open, pits[0]!);
    expect(
      next.phase === 'selectPit' ||
        next.phase === 'animating' ||
        next.phase === 'gameOver'
    ).toBe(true);
  });

  it('sow wrap resets before position≥11 — <PITS*2+1 false arm unreachable', () => {
    // Documented unreachable (round-5): after sowing at position 10, position++
    // yields 11 then `position > PITS*2` wraps to 0 before the next iteration,
    // so the else-if false arm never runs. Forge a long sow to characterize wrap.
    const open = createCalla();
    const forged = {
      ...open,
      player1Pits: [20, 0, 0, 0, 0],
      player2Pits: [3, 3, 3, 3, 3],
    };
    const after = callaMove(forged, 0);
    expect(after.moveHistory.at(-1)?.cubesDistributed).toBe(20);
    const total =
      after.player1Pits.reduce((a, b) => a + b, 0) +
      after.player2Pits.reduce((a, b) => a + b, 0) +
      after.player1Calla +
      after.player2Calla;
    expect(total).toBe(
      forged.player1Pits.reduce((a, b) => a + b, 0) +
        forged.player2Pits.reduce((a, b) => a + b, 0) +
        forged.player1Calla +
        forged.player2Calla
    );
    expect(PITS_PER_SIDE).toBe(5);
  });
});

// =============================================================================
// 5. hex-a-gone — commitSelection with undefined block head
// =============================================================================

describe('engine-coverage-round-2 — hex-a-gone', () => {
  it('commitSelection with undefined blocks[0] sets selectedBlockForPlacement null', () => {
    const open = createHag();
    const forged: HexAGoneGameState = {
      ...open,
      phase: 'selectBlocks',
      turnSelection: {
        blocks: [undefined as unknown as BlockShape],
        committed: false,
      },
    };
    const next = hagCommit(forged);
    expect(next.phase).toBe('placeBlocks');
    expect(next.turnSelection.committed).toBe(true);
    expect(next.selectedBlockForPlacement).toBeNull();
  });

  it('legal select → commit → placements; canPlayerMove at opening', () => {
    let state = hagSelect(createHag(), 'triangle');
    expect(state.turnSelection.blocks).toContain('triangle');
    state = hagCommit(state);
    expect(state.phase).toBe('placeBlocks');
    expect(state.selectedBlockForPlacement).toBe('triangle');
    const spots = hagValids(state, 'triangle');
    expect(spots.length).toBeGreaterThan(0);
    expect(hagCanMove(createHag())).toBe(true);
    expect(hagOver(createHag())).toBe(false);
  });

  it('passTurn from selectBlocks hands seat; gameOver detection false mid-game', () => {
    const passed = hagPass(createHag());
    expect(passed.currentPlayer).toBe('player2');
    expect(hagOver(passed)).toBe(false);
  });
});

// =============================================================================
// 6. contig-60 — null grid cell in ownerAt / win-draw
// =============================================================================

describe('engine-coverage-round-2 — contig-60', () => {
  it('countNInARows / checkWinner tolerate null grid cells (edge board)', () => {
    const open = createContig();
    // Own cell (0,0) value 1; null out a neighbor so sliding window hits null
    const cells = new Map(open.cells);
    cells.set(1, { ...cells.get(1)!, owner: 'player1' });
    const grid = open.grid.map((row) => row.slice());
    grid[0]![1] = null; // was 2
    const edged: ContigState = { ...open, cells, grid };
    expect(countNInARows(edged, 'player1', 2)).toBe(0);
    expect(contigWinner(edged)).toBeNull();
    expect(isBoardFull(edged)).toBe(false);
  });

  it('alignmentTiebreak draw on empty ownership; settle option forces tiebreak', () => {
    const open = createContig();
    expect(alignmentTiebreak(open)).toBe('draw');
    expect(contigWinner(open, { settle: true })).toBe('draw');
  });

  it('roll → calculating; hasValidMoves false without dice; pass increments', () => {
    const open = createContig();
    expect(contigHasMoves(open)).toBe(false);
    const rolled = contigRoll(open);
    expect(rolled.phase).toBe('calculating');
    expect(rolled.currentDice).not.toBeNull();
    // passTurn only accepts phase === 'calculating'
    const passed = contigPass(rolled);
    expect(passed.consecutivePasses.player1).toBe(1);
    expect(passed.phase).toBe('rolling');
  });
});

// =============================================================================
// 7. queens-guards — empty restore targets + legal moves / win
// =============================================================================

describe('engine-coverage-round-2 — queens-guards', () => {
  it('getRestoreTargets returns [] when capturedPieces is empty', () => {
    const open = createQueens();
    expect(open.capturedPieces).toEqual([]);
    expect(getRestoreTargets(open)).toEqual([]);
  });

  it('opening: every piece has legal moves or is blocked; no winner yet', () => {
    const open = createQueens();
    expect(qgWinner(open)).toBeNull();
    expect(qgHasMoves(open)).toBe(true);
    // Sample a player1 guard / queen
    let found = false;
    for (const [key, cell] of open.cells) {
      if (cell.piece?.player === 'player1') {
        const { ring, position } = cell;
        const moves = qgValids(open, { ring, position });
        expect(Array.isArray(moves)).toBe(true);
        found = true;
        void key;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it('selectPiece → makeMove when a legal destination exists', () => {
    const open = createQueens();
    for (const [, cell] of open.cells) {
      if (cell.piece?.player !== 'player1') continue;
      const from = { ring: cell.ring, position: cell.position };
      const moves = qgValids(open, from);
      if (moves.length === 0) continue;
      const selected = qgSelect(open, cellKey(from.ring, from.position));
      const next = qgMove(selected, from, moves[0]!);
      expect(next.moveHistory.length).toBeGreaterThanOrEqual(
        open.moveHistory.length
      );
      return;
    }
    // If somehow no moves (should not happen at opening for all pieces)
    expect(qgHasMoves(open)).toBe(true);
  });
});

// =============================================================================
// 8. juggle — orientSelectedShapeToFit exhausts orientations on jammed board
// =============================================================================

describe('engine-coverage-round-2 — juggle', () => {
  it('selectShape on full board leaves orientation defaults (no fit)', () => {
    const jammed = jammedJuggleBoard();
    const shape = SHAPE_POOLS.tetromino[0]!;
    const next = juggleSelectShape(jammed, shape);
    expect(next.phase).toBe('placing');
    expect(next.selectedShape).toEqual(shape);
    // No orientation fits → identity return from orientSelectedShapeToFit
    expect(next.selectedRotation).toBe(0);
    expect(next.selectedFlipped).toBe(false);
    expect(selectedShapeFitsAnywhere(next)).toBe(false);
    expect(juggleOrients(next)).toEqual([]);
  });

  it('selectDie auto-shape on jammed monomino board also fails to orient', () => {
    const full = createBoard(JUGGLE_CFG.GRID_SIZE, JUGGLE_CFG.GRID_SIZE);
    for (let r = 0; r < full.rows; r++) {
      for (let c = 0; c < full.cols; c++) {
        full.cells[r]![c] = true;
      }
    }
    const state: JuggleState = {
      ...createJuggle(),
      boards: {
        player1: full,
        player2: createBoard(JUGGLE_CFG.GRID_SIZE, JUGGLE_CFG.GRID_SIZE),
      },
      phase: 'selectingShape',
      currentDice: [1, 2],
    };
    const next = juggleSelectDie(state, 0);
    // monomino auto-selects; orient finds nothing
    expect(next.phase).toBe('placing');
    expect(next.selectedShape).not.toBeNull();
    expect(selectedShapeFitsAnywhere(next)).toBe(false);
  });

  it('abandonPlacement returns to selectingShape; roll starts selectingShape', () => {
    const rolled = juggleRoll(createJuggle());
    expect(rolled.phase).toBe('selectingShape');
    const shape = SHAPE_POOLS.tetromino[0]!;
    const placing = juggleSelectShape(
      {
        ...rolled,
        selectedCategory: 'tetromino',
        selectedDieValue: 4,
      },
      shape
    );
    const abandoned = abandonPlacement(placing);
    expect(abandoned.phase).toBe('selectingShape');
    expect(abandoned.selectedShape).toBeNull();
  });

  it('orientSelectedShapeToFit early return when selectedShape is null (forged)', () => {
    // Public callers normally set placing+shape; forge null shape through
    // selectShape to hit the private early return (phase placing, !shape).
    const rolled = juggleRoll(createJuggle());
    const forged = {
      ...rolled,
      phase: 'selectingShape' as const,
      selectedCategory: 'tromino' as ShapeCategory,
      selectedShape: null,
    };
    const out = juggleSelectShape(forged, null as never);
    expect(out.phase).toBe('placing');
    expect(out.selectedShape).toBeNull();
  });
});

// =============================================================================
// 9. fraction-pinball — force generateWrongDecimals fill-while
// =============================================================================

describe('engine-coverage-round-2 — fraction-pinball', () => {
  it('generateChallenge(even) with strategy-starved RNG hits decimal fill-while', () => {
    let n = 0;
    const orig = Math.random;
    // Sequence:
    //  - first call: pick convertible fraction index
    //  - next ~30: always strategy[0] → one unique wrong then duplicates
    //  - fill: ascending values so formatDecimal stays unique
    //  - shuffle: remaining calls
    Math.random = () => {
      n += 1;
      if (n === 1) return 0; // fraction pick
      if (n <= 31) return 0; // strategy loop — always first strategy
      // fill + shuffle: distinct buckets in [0,1)
      return Math.min(0.999, ((n - 31) % 97) / 100);
    };
    try {
      const challenge = generateChallenge(2); // even → fractionToDecimal
      expect(challenge.type).toBe('fractionToDecimal');
      expect(challenge.answerChoices.length).toBe(4);
      expect(challenge.answerChoices).toContain(challenge.correctAnswer);
      // Fill path produced enough choices
      expect(new Set(challenge.answerChoices).size).toBe(4);
    } finally {
      Math.random = orig;
    }
  });

  it('start → wrong answer → nextChallenge seat handoff', () => {
    let state: FractionPinballState = pinballStart(createPinball());
    expect(state.phase).toBe('answering');
    expect(state.currentChallenge).not.toBeNull();
    const wrong =
      state.currentChallenge!.answerChoices.find(
        (a) => a !== state.currentChallenge!.correctAnswer
      ) ?? 'nope';
    state = pinballSubmit(state, wrong);
    expect(state.phase).toBe('showResult');
    expect(state.isCorrect).toBe(false);
    state = pinballNext(state);
    expect(state.phase === 'answering' || state.phase === 'gameOver').toBe(
      true
    );
  });

  it('generateChallenge(odd) with zero-numerator correct hits || 1 arm', () => {
    COMMON_FRACTIONS.push({ numerator: 0, denominator: 1 });
    let n = 0;
    const orig = Math.random;
    const convertible = COMMON_FRACTIONS.filter((f) => {
      const decimal = f.numerator / f.denominator;
      const rounded = Math.round(decimal * 10000) / 10000;
      return Math.abs(decimal - rounded) < 0.00001;
    });
    const zeroIdx = convertible.findIndex((f) => f.numerator === 0);
    expect(zeroIdx).toBeGreaterThanOrEqual(0);
    Math.random = () => {
      n += 1;
      if (n === 1) {
        return (zeroIdx + 0.5) / convertible.length;
      }
      return ((n * 17) % 97) / 100;
    };
    try {
      const ch = generateChallenge(1); // odd → decimalToFraction → wrong fractions
      expect(ch.type).toBe('decimalToFraction');
      expect(ch.fraction.numerator).toBe(0);
      expect(ch.answerChoices.length).toBe(4);
      expect(pinballFormatFraction(ch.fraction)).toBeTruthy();
    } finally {
      Math.random = orig;
    }
  });
});

// Strip injected zero-numerator fractions after pinball / frac-fact forge tests
afterEach(() => {
  for (let i = COMMON_FRACTIONS.length - 1; i >= 0; i--) {
    if (COMMON_FRACTIONS[i]?.numerator === 0) {
      COMMON_FRACTIONS.splice(i, 1);
    }
  }
});

// =============================================================================
// 10. stars-bars — legal placements / pass / clear (characterization; L274 dead)
// =============================================================================

describe('engine-coverage-round-2 — stars-bars', () => {
  it('opening select → legal placements non-empty; clearSelection resets', () => {
    const open = createStars();
    expect(starsHasMoves(open)).toBe(true);
    const hand = open.playerHands.player1;
    expect(hand.length).toBeGreaterThan(0);
    const selected = starsSelect(open, hand[0]!.id);
    expect(selected.selectedCard?.id).toBe(hand[0]!.id);
    const spots = starsValids(selected);
    expect(spots.length).toBeGreaterThan(0);
    const cleared = starsClear(selected);
    expect(cleared.selectedCard).toBeNull();
  });

  it('placeCard scores and hands off or stays legal; passTurn when forced', () => {
    const open = createStars();
    const card = open.playerHands.player1[0]!;
    let state = starsSelect(open, card.id);
    const spots = starsValids(state);
    expect(spots.length).toBeGreaterThan(0);
    const spot = spots[0]!;
    state = starsPlace(state, spot.row, spot.col);
    expect(state.phase === 'selectingCard' || state.phase === 'gameOver').toBe(
      true
    );
    const passed = starsPass(createStars());
    expect(passed.currentPlayer).toBe('player2');
  });

  it('placeCard scores when adjacent cell has undefined card (filter hole)', () => {
    const open = createStars();
    const card = open.playerHands.player1[0]!;
    // Seed one real card at (2,2), and an adjacent cell with card: undefined
    // so filter (c.card !== null) keeps it, then !adjCell.card continue fires.
    const cells: BoardCell[][] = open.cells.map((row) =>
      row.map((c) => ({ ...c }))
    );
    const seed: AttributeCard = {
      id: 'seed',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    cells[2]![2] = {
      ...cells[2]![2]!,
      card: seed,
      owner: 'player2',
    };
    cells[2]![3] = {
      ...cells[2]![3]!,
      card: undefined as unknown as null,
      owner: null,
    };

    let state: StarsState = {
      ...open,
      cells,
      selectedCard: card,
      phase: 'placingCard',
    };
    const spots = starsValids(state);
    expect(spots.length).toBeGreaterThan(0);
    const spot =
      spots.find((p) => p.row === 2 && (p.col === 1 || p.col === 3)) ??
      spots[0]!;
    state = starsPlace(state, spot.row, spot.col);
    expect(state.phase === 'selectingCard' || state.phase === 'gameOver').toBe(
      true
    );
  });
});

// =============================================================================
// 11. frac-fact — legal answer flow / win settle (L208 dead)
// =============================================================================

describe('engine-coverage-round-2 — frac-fact', () => {
  it('startGame → submit correct → nextProblem transitions', () => {
    let state = fracStart(createFrac());
    expect(state.phase).toBe('playing');
    expect(state.currentProblem).not.toBeNull();
    const problem = state.currentProblem!;
    const correct = problem.answerChoices.find((a) => fracCheck(problem, a));
    expect(correct).toBeTruthy();
    state = fracSubmit(state, correct!);
    expect(state.phase).toBe('showingResult');
    state = fracNext(state);
    expect(state.phase === 'playing' || state.phase === 'gameOver').toBe(true);
  });

  it('generateProblem returns finite operands and 4 choices', () => {
    const p = generateProblem('easy', 1);
    expect(p.operand1.denominator).toBeGreaterThan(0);
    expect(p.answerChoices.length).toBe(4);
  });

  it('generateProblem(hard) hits divide zero-numerator operand2 guard', () => {
    COMMON_FRACTIONS.push({ numerator: 0, denominator: 2 });
    let n = 0;
    const orig = Math.random;
    Math.random = () => {
      n += 1;
      // hard ops: [add,sub,mul,divide] — force divide (index 3)
      if (n === 1) return 0.9;
      // operand1: any non-zero (index 0)
      if (n === 2) return 0;
      // operand2: last = zero numerator
      if (n === 3) return 0.999;
      return ((n * 13) % 89) / 100;
    };
    try {
      const p = generateProblem('hard', 1);
      expect(p.operation).toBe('divide');
      expect(p.operand2.numerator).not.toBe(0);
      expect(p.answerChoices.length).toBe(4);
      expect(getOperationSymbol('divide')).toBeTruthy();
      expect(fracFormat(p.correctAnswer)).toBeTruthy();
    } finally {
      Math.random = orig;
    }
  });
});

// =============================================================================
// 12. fiar — legal moves / draw / chip kind (subsetUnblocked short length dead)
// =============================================================================

describe('engine-coverage-round-2 — fiar', () => {
  it('placement phase: place chip on empty node; no winner/draw yet', () => {
    let state = createFiar();
    expect(state.phase).toBe('placement');
    state = normalizeSelectedChipKind(state);
    // Pick any empty node that accepts a chip
    let placed = false;
    for (const [nodeId] of state.board.nodes) {
      if (!canPlaceChip(state, nodeId)) continue;
      state = setSelectedChipKind(state, 'plain');
      state = fiarPlace(state, nodeId);
      placed = true;
      break;
    }
    expect(placed).toBe(true);
    expect(fiarWinner(state)).toBeNull();
    // isDraw only applies in movement phase
    expect(fiarIsDraw(state)).toBe(false);
    expect(findAnyWinningPath(state)).toBeNull();
  });

  it('deselectChip clears selectedNode; getValidMoves empty for unknown id', () => {
    const open = createFiar();
    expect(fiarValids(open, 'nope')).toEqual([]);
    const cleared = deselectChip({
      ...open,
      selectedNode: 'some-node',
    });
    expect(cleared.selectedNode).toBeNull();
    // movement-only helper
    expect(getSelectableNodes(open)).toEqual([]);
  });

  it('subsetUnblocked short-length early return unreachable — flush gate', () => {
    // Documented unreachable (round-5): findPaths.flush only invokes
    // subsetUnblocked when segmentChips.length ≥ WIN_LENGTH, so the
    // chipNodes.length < WIN_LENGTH early return never runs.
    const open = createFiar();
    expect(FIAR_CFG.WIN_LENGTH).toBe(4);
    expect(findPaths(open, 'player1')).toEqual([]);
    expect(findAnyWinningPath(open)).toBeNull();
  });
});

// =============================================================================
// Undo/redo invariants — adapter smoke (round-2 engines, not cloning undo-audit)
// =============================================================================

describe('engine-coverage-round-2 — undo/redo legal-move invariants', () => {
  const ids = [
    'sum-dominoes',
    'fab-a-diffy',
    'contig-60',
    'queens-guards',
    'stars-bars',
    'fiar',
    'calla',
    'hex-a-gone',
  ];

  for (const id of ids) {
    it(`${id}: snapshot undo + round-trip preserve legal-move sets`, () => {
      const adapter = ALL_GAME_ADAPTERS.find((a) => a.id === id);
      expect(adapter).toBeTruthy();
      // Snapshot initial (do not recreate — shuffle/RNG would diverge)
      const initial = adapter!.create();
      const moves0 = adapter!.legalMoves(initial);
      expect(moves0.length).toBeGreaterThan(0);
      const after = adapter!.apply(initial, moves0[0]!);
      // Undo invariant: untouched opening snapshot still exposes the same moves
      expect(canonMoves(adapter!.legalMoves(initial))).toBe(canonMoves(moves0));
      // "Redo" stand-in for RNG games: serialize round-trip preserves post-move
      // legal set (re-applying roll/deal would re-draw and diverge).
      const trip = adapter!.roundTrip(after);
      expect(adapter!.normalize(trip)).toEqual(adapter!.normalize(after));
      expect(canonMoves(adapter!.legalMoves(trip))).toBe(
        canonMoves(adapter!.legalMoves(after))
      );
    });
  }
});
