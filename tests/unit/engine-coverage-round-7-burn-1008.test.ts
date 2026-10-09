/**
 * q-mp-252 — engine coverage round 7: post-r6 residual characterization.
 *
 * Themes: cold NON-RULES helpers (types / board / game-state) still under
 * branch coverage after rounds 1–6 cleared every `it.todo` call-site.
 * Pins CURRENT behavior only. Does not change engine / rules.ts / AI source.
 *
 * Baseline rank (tip post748, coverage-engine-r7-baseline):
 *   ramrod/types 66.7% · kings/board 75% · sum-dominoes/types 75% ·
 *   star-track/types 83.3% · queens-guards/types 85.7% · kings/game-state 90.9% ·
 *   contig-60/types 92.5% · …
 */
import { describe, expect, it } from 'vitest';

import {
  createRodSet,
  shuffleArray as ramrodShuffle,
} from '../../src/games/ramrod/types';

import {
  shuffleArray as sumShuffle,
  getDominoPips,
  isDouble,
  createDominoSet,
  rollDice as sumRollDice,
  getDiceSum,
} from '../../src/games/sum-dominoes/types';

import {
  BOARD_SIZE,
  createInitialBoard,
  createInitialGameState as createBoardState,
  fromOneBasedPosition,
  toOneBasedPosition,
  getPiece,
  isEmpty,
  hasSupply,
  isValidPosition,
  type Board,
} from '../../src/games/kings-quadraphages/board';
import {
  createInitialGameState as createKingsState,
  getKingPosition,
} from '../../src/games/kings-quadraphages/game-state';

import {
  createBoard as createQueensBoard,
  cellKey,
  cellsInRing,
  CONFIG as QG_CONFIG,
  createInitialState as createQueens,
} from '../../src/games/queens-guards/types';

import {
  BOARD_NUMBERS,
  CONFIG as CONTIG_CONFIG,
  createBoard as createContigBoard,
  createInitialState as createContig,
  getAllPossibleResults,
  getValidPlacements,
  rollDice as contigRoll,
} from '../../src/games/contig-60/types';

import {
  createChainBucket,
  createInitialState as createStar,
} from '../../src/games/star-track/types';

import {
  createFiarBoard,
  getNodesInDirection,
  areConnected,
} from '../../src/games/fiar/types';

import {
  generateExpressions,
  isGoldbachNumber,
  isPrime,
  factorial,
} from '../../src/games/prime-gold/types';

// =============================================================================
// 1. ramrod/types.ts — coldest non-rules (branch 66.7%)
// =============================================================================

describe('engine-coverage-round-7 — ramrod/types', () => {
  it('shuffleArray continues when a slot is undefined (hole-guard)', () => {
    const input: Array<number | undefined> = [1, undefined, 3, 4, 5];
    const out = ramrodShuffle(input);
    expect(out).toHaveLength(5);
    expect(out.filter((x) => x !== undefined).sort()).toEqual([1, 3, 4, 5]);
  });

  it('createRodSet covers lengths 1–10 (count===undefined arm unreachable)', () => {
    // Documented unreachable: local `counts` Record defines every length 1–10,
    // so `if (count === undefined) continue` never fires on the public path.
    const set = createRodSet();
    const byLen = new Map<number, number>();
    for (const rod of set) {
      byLen.set(rod.length, (byLen.get(rod.length) ?? 0) + 1);
    }
    for (let length = 1; length <= 10; length++) {
      expect(byLen.has(length)).toBe(true);
    }
    expect(set.length).toBe(39);
  });
});

// =============================================================================
// 2. sum-dominoes/types.ts — shuffle hole-guard + catalog helpers
// =============================================================================

describe('engine-coverage-round-7 — sum-dominoes/types', () => {
  it('shuffleArray continues when swapped slots hold undefined', () => {
    const input: Array<string | undefined> = ['a', undefined, 'c', 'd'];
    const out = sumShuffle(input);
    expect(out).toHaveLength(4);
    expect(out.filter((x) => typeof x === 'string').sort()).toEqual([
      'a',
      'c',
      'd',
    ]);
  });

  it('createDominoSet / pips / doubles / dice sum', () => {
    const set = createDominoSet();
    expect(set.length).toBeGreaterThan(0);
    const double = set.find((d) => d.face1 === d.face2);
    expect(double).toBeDefined();
    expect(isDouble(double!)).toBe(true);
    expect(getDominoPips(double!)).toBe(double!.face1 * 2);
    const nonDouble = set.find((d) => d.face1 !== d.face2);
    expect(nonDouble).toBeDefined();
    expect(isDouble(nonDouble!)).toBe(false);
    const dice = sumRollDice();
    expect(dice).toHaveLength(2);
    expect(getDiceSum(dice)).toBe(dice[0]! + dice[1]!);
  });
});

// =============================================================================
// 3. kings-quadraphages/board.ts — sparse-board row/cell guards
// =============================================================================

describe('engine-coverage-round-7 — kings/board', () => {
  it('getPiece / isEmpty return null/false for OOB and forged sparse rows', () => {
    const board = createInitialBoard();
    expect(getPiece(board, { row: -1, col: 0 })).toBeNull();
    expect(isEmpty(board, { row: -1, col: 0 })).toBe(false);
    expect(isValidPosition({ row: 0, col: 0 })).toBe(true);
    expect(isValidPosition({ row: BOARD_SIZE, col: 0 })).toBe(false);

    // Forge: punch out a dense row so board[row] === undefined.
    const sparse = board.slice() as Board;
    delete sparse[4];
    expect(getPiece(sparse, { row: 4, col: 0 })).toBeNull();
    expect(isEmpty(sparse, { row: 4, col: 0 })).toBe(false);

    // Forge: keep the row but punch a column hole → cell === undefined.
    const shortRow = board.slice() as Board;
    shortRow[3] = [];
    expect(getPiece(shortRow, { row: 3, col: 0 })).toBeNull();
  });

  it('fromOneBased / toOneBased / hasSupply on createInitialGameState', () => {
    const zero = fromOneBasedPosition(1, 5);
    expect(zero).toEqual({ row: 0, col: 4 });
    expect(toOneBasedPosition(zero)).toEqual({ row: 1, col: 5 });
    const state = createBoardState();
    expect(hasSupply(state, 'player1')).toBe(true);
    expect(hasSupply({ ...state, player1Supply: 0 }, 'player1')).toBe(false);
    expect(getPiece(state.board, { row: 0, col: 4 })?.type).toBe('king');
    expect(isEmpty(state.board, { row: 4, col: 4 })).toBe(true);
  });
});

// =============================================================================
// 4. kings-quadraphages/game-state.ts — getKingPosition sparse-row continue
// =============================================================================

describe('engine-coverage-round-7 — kings/game-state', () => {
  it('getKingPosition skips forged undefined board rows then finds the king', () => {
    const state = createKingsState();
    // Punch a non-king row so boardRow === undefined continue fires.
    delete state.board[1];
    const p1 = getKingPosition(state, 'player1');
    expect(p1).not.toBeNull();
    // getKingPosition returns 1-based coords
    expect(p1).toEqual({ row: 1, col: 5 });

    // Punch the king row → player1 absent; player2 still found.
    delete state.board[0];
    expect(getKingPosition(state, 'player1')).toBeNull();
    expect(getKingPosition(state, 'player2')).toEqual({ row: 9, col: 5 });
  });
});

// =============================================================================
// 5. queens-guards/types.ts — createBoard cell===undefined continues
// =============================================================================

describe('engine-coverage-round-7 — queens-guards/types', () => {
  it('createBoard seats queens; cell===undefined continues are unreachable on Map', () => {
    // Documented unreachable: createBoard always `cells.set` before `cells.get`
    // for the same outer-ring keys, so `if (cell === undefined) continue` never
    // fires on a real Map. Do not spy Map.prototype.get (isolate:false workers
    // share the prototype with AI calibration suites).
    const outerRing = QG_CONFIG.NUM_RINGS - 1;
    const outerCount = cellsInRing(outerRing);
    const board = createQueensBoard();
    expect(board.size).toBeGreaterThan(outerCount);
    expect(board.get(cellKey(outerRing, 7))?.piece?.type).toBe('queen');
    expect(board.get(cellKey(outerRing, 22))?.piece?.type).toBe('queen');
    // Guard seats that the continue would have skipped still exist with pieces.
    expect(board.get(cellKey(outerRing, 1))?.piece?.type).toBe('guard');
    expect(board.get(cellKey(outerRing, 16))?.piece?.type).toBe('guard');
    const open = createQueens();
    expect(open.cells.size).toBe(board.size);
    expect(open.currentPlayer).toBe('player1');
  });
});

// =============================================================================
// 6. contig-60/types.ts — short/jagged boardNumbers + expression helpers
// =============================================================================

describe('engine-coverage-round-7 — contig-60/types', () => {
  it('createBoard skips missing rows and jagged columns', () => {
    const short = BOARD_NUMBERS.slice(0, 2);
    const { cells: shortCells, grid: shortGrid } = createContigBoard(short);
    expect(shortGrid.length).toBe(CONTIG_CONFIG.GRID_ROWS);
    // Only the first two rows were populated from numberRow.
    expect(shortCells.size).toBeLessThan(60);
    expect(shortGrid[0]?.length).toBeGreaterThan(0);
    expect(shortGrid[5]?.every((v) => v === null || v === undefined)).toBe(
      true
    );

    const jagged = BOARD_NUMBERS.map((row, i) =>
      i === 1 ? row.slice(0, 2) : row
    );
    const { cells: jaggedCells, grid: jaggedGrid } = createContigBoard(jagged);
    expect(jaggedGrid[1]!.length).toBe(2);
    expect(jaggedCells.size).toBeLessThan(60);
  });

  it('getAllPossibleResults / getValidPlacements / rollDice smoke', () => {
    const dice: [number, number, number] = [1, 2, 3];
    const all = getAllPossibleResults(dice);
    expect(all.length).toBeGreaterThan(0);
    for (const { result, expression } of all) {
      expect(result).toBeGreaterThan(0);
      expect(expression.length).toBeGreaterThan(0);
    }
    const state = createContig();
    const valid = getValidPlacements(state, dice);
    expect(valid.every((v) => state.cells.get(v.result)?.owner === null)).toBe(
      true
    );
    const rolled = contigRoll();
    expect(rolled).toHaveLength(3);
    expect(rolled.every((d) => d >= 1 && d <= 6)).toBe(true);
  });
});

// =============================================================================
// 7. star-track/types.ts — private shuffle hole-guard (documented)
// =============================================================================

describe('engine-coverage-round-7 — star-track/types', () => {
  it('createChainBucket returns 24 chains; private shuffle hole-guard unreachable', () => {
    // Documented unreachable (rounds 3–5): shuffleArray is module-private and
    // only receives a dense bucket from createChainBucket — no public inject path.
    const bucket = createChainBucket();
    expect(bucket).toHaveLength(24);
    const lengths = new Set(bucket.map((c) => c.length));
    expect(lengths.size).toBe(6);
    const open = createStar();
    expect(open.phase).toBe('drawChains');
    expect(open.player1Position).toBe(0);
  });
});

// =============================================================================
// 8. fiar/types.ts — prevId===undefined when startId is undefined + neighbor
// =============================================================================

describe('engine-coverage-round-7 — fiar/types', () => {
  it('getNodesInDirection breaks when prevId is undefined (forged start)', () => {
    const board = createFiarBoard();
    const spacing = board.spacing;
    const undefId = undefined as unknown as string;
    board.nodes.set(undefId, {
      id: undefId,
      x: 10_000,
      y: 10_000,
      chip: null,
      chipKind: null,
    });
    board.nodes.set('forge-east', {
      id: 'forge-east',
      x: 10_000 + spacing,
      y: 10_000,
      chip: null,
      chipKind: null,
    });
    board.edges.push({
      from: undefId,
      to: 'forge-east',
      crossesYellowCenter: false,
    });
    expect(areConnected(board, undefId, 'forge-east')).toBe(true);
    // result.length===0 → prevId = startId = undefined → break (line 242).
    const out = getNodesInDirection(board, undefId, spacing, 0);
    expect(out).toEqual([]);
  });
});

// =============================================================================
// 9. prime-gold/types.ts — expression / Goldbach / factorial pins
// =============================================================================

describe('engine-coverage-round-7 — prime-gold/types', () => {
  it('generateExpressions yields positives; hole-continues unreachable under filter', () => {
    // Documented unreachable: vals/basicVals are built then .filter()'d to a
    // dense array, so left/right/a/b/c === undefined continues never fire.
    const exprs = generateExpressions(2, 3, 4);
    expect(exprs.length).toBeGreaterThan(0);
    expect(exprs.every((e) => e.value > 0 && Number.isInteger(e.value))).toBe(
      true
    );
  });

  it('isGoldbachNumber / isPrime / factorial edges (types-only)', () => {
    // Loop-exhaust return false remains unreachable for even n in 4..200
    // (every even is sum of two primes under isPrime) — pinned as invariant.
    for (let n = 4; n <= 60; n += 2) {
      expect(isGoldbachNumber(n)).toBe(true);
    }
    expect(isGoldbachNumber(3)).toBe(false);
    expect(isGoldbachNumber(2)).toBe(false);
    expect(isPrime(2)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(factorial(0)).toBe(1);
    expect(Number.isNaN(factorial(-1))).toBe(true);
  });
});
