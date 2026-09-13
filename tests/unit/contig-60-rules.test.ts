import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  ContigState,
  Player,
  createInitialState,
  createBoard,
  getAllPossibleResults,
  getValidPlacements,
  getAdjacentPositions,
  CONFIG,
} from '../../src/games/contig-60/types';
import {
  doRollDice,
  placeChip,
  passTurn,
  calculatePoints,
  checkWinner,
  hasValidMoves,
} from '../../src/games/contig-60/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function withDice(
  state: ContigState,
  dice: [number, number, number],
  phase: ContigState['phase'] = 'calculating'
): ContigState {
  return { ...state, currentDice: dice, phase };
}

function claimCells(
  state: ContigState,
  values: number[],
  owner: Player
): ContigState {
  const cells = new Map(state.cells);
  for (const value of values) {
    const cell = cells.get(value);
    if (!cell) throw new Error(`missing cell ${value}`);
    cells.set(value, { ...cell, owner });
  }
  return { ...state, cells };
}

describe('Contig 60 – expression / placement helpers', () => {
  it('getAllPossibleResults includes simple products and sums', () => {
    const results = getAllPossibleResults([2, 3, 4]);
    const values = results.map((r) => r.result);

    expect(values).toContain(24); // 2*3*4
    expect(values).toContain(9); // (2+3)+4 or similar
    expect(values.every((v) => Number.isInteger(v) && v > 0)).toBe(true);
    expect(results.every((r) => typeof r.expression === 'string')).toBe(true);
  });

  it('getAllPossibleResults rejects non-integer division paths', () => {
    // 1, 2, 5 — (1/2)*5 is not integer; still has valid paths
    const results = getAllPossibleResults([1, 2, 5]);
    expect(results.every((r) => Number.isInteger(r.result))).toBe(true);
    expect(results.some((r) => r.result === 7)).toBe(true); // 1+2+...? or 2*5- something
  });

  it('getValidPlacements only returns unowned board numbers', () => {
    let state = createInitialState();
    state = claimCells(state, [6, 12], 'player1');
    const placements = getValidPlacements(state, [2, 3, 4]);
    const results = placements.map((p) => p.result);

    expect(results).not.toContain(6);
    expect(results).not.toContain(12);
    expect(results.every((v) => state.cells.has(v))).toBe(true);
  });

  it('getAdjacentPositions respects board edges', () => {
    expect(getAdjacentPositions(0, 0)).toHaveLength(3);
    expect(getAdjacentPositions(0, 5)).toHaveLength(5);
    expect(getAdjacentPositions(2, 4)).toHaveLength(8);
    expect(getAdjacentPositions(5, 9)).toHaveLength(3);
  });
});

describe('Contig 60 – doRollDice', () => {
  it('transitions from rolling to calculating with dice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // all dice = 1
    const state = createInitialState();
    const next = doRollDice(state);

    expect(next.phase).toBe('calculating');
    expect(next.currentDice).toEqual([1, 1, 1]);
  });

  it('is a no-op outside rolling phase', () => {
    const state = withDice(createInitialState(), [1, 2, 3], 'calculating');
    expect(doRollDice(state)).toBe(state);
  });
});

describe('Contig 60 – calculatePoints / placeChip', () => {
  it('awards 0 points on an isolated first placement', () => {
    const state = withDice(createInitialState(), [1, 2, 3]);
    expect(calculatePoints(state, 6)).toBe(0);
  });

  it('awards adjacency points for neighboring owned cells', () => {
    let state = createInitialState();
    // 1 is at (0,0), neighbors include 2 (0,1) and 11 (1,0)
    state = claimCells(state, [2, 11], 'player1');
    expect(calculatePoints(state, 1)).toBe(2);
  });

  it('places chip, records move, switches player, returns to rolling', () => {
    let state = withDice(createInitialState(), [2, 3, 4]);
    const placements = getValidPlacements(state, [2, 3, 4]);
    expect(placements.length).toBeGreaterThan(0);

    const { result, expression } = placements[0];
    state = placeChip(state, result, expression);

    expect(state.cells.get(result)?.owner).toBe('player1');
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('rolling');
    expect(state.currentDice).toBeNull();
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0]).toMatchObject({
      player: 'player1',
      result,
      expression,
    });
    expect(state.consecutivePasses.player1).toBe(0);
  });

  it('rejects placement on occupied or invalid cells', () => {
    let state = claimCells(createInitialState(), [6], 'player2');
    state = withDice(state, [1, 2, 3]);
    const before = state;
    expect(placeChip(state, 6, '1+2+3')).toBe(before);
    expect(placeChip(state, 999, 'x')).toBe(before);
  });

  it('rejects placeChip when not in calculating phase', () => {
    const state = createInitialState();
    expect(placeChip(state, 6, '1+2+3')).toBe(state);
  });

  it('adds adjacency score on successful place', () => {
    let state = claimCells(createInitialState(), [2], 'player1');
    state = withDice(state, [1, 1, 1]);
    // Force a known valid placement: result 1 with expression stub
    // 1 is adjacent to 2 → 1 point
    state = {
      ...state,
      currentDice: [1, 2, 3],
      phase: 'calculating',
    };
    const next = placeChip(state, 1, '1+2-2');
    expect(next.scores.player1).toBe(1);
    expect(next.moveHistory[0].points).toBe(1);
  });
});

describe('Contig 60 – passTurn / elimination', () => {
  it('increments consecutive passes and swaps players', () => {
    const state = withDice(createInitialState(), [1, 1, 1]);
    const next = passTurn(state);

    expect(next.consecutivePasses.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.currentDice).toBeNull();
  });

  it('eliminates player after MAX_CONSECUTIVE_PASSES', () => {
    let state = withDice(createInitialState(), [1, 1, 1]);
    state = {
      ...state,
      consecutivePasses: {
        player1: CONFIG.MAX_CONSECUTIVE_PASSES - 1,
        player2: 0,
      },
    };

    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.consecutivePasses.player1).toBe(CONFIG.MAX_CONSECUTIVE_PASSES);
  });

  it('is a no-op outside calculating phase', () => {
    const state = createInitialState();
    expect(passTurn(state)).toBe(state);
  });
});

describe('Contig 60 – checkWinner / hasValidMoves', () => {
  it('detects horizontal five-in-a-row', () => {
    // Row 0: values 1..10
    let state = claimCells(createInitialState(), [1, 2, 3, 4, 5], 'player1');
    expect(checkWinner(state)).toBe('player1');
  });

  it('detects vertical five-in-a-row', () => {
    // Col 0: 1,11,25,48,84 (+17 is 6th)
    let state = claimCells(
      createInitialState(),
      [1, 11, 25, 48, 84],
      'player2'
    );
    expect(checkWinner(state)).toBe('player2');
  });

  it('returns null when board incomplete and no alignment', () => {
    const state = claimCells(createInitialState(), [1, 2, 3], 'player1');
    expect(checkWinner(state)).toBeNull();
  });

  it('picks higher score when board is full', () => {
    const { cells, grid } = createBoard();
    for (const cell of cells.values()) {
      cell.owner = cell.row % 2 === 0 ? 'player1' : 'player2';
    }
    const state: ContigState = {
      ...createInitialState(),
      cells,
      grid,
      scores: { player1: 12, player2: 7 },
    };
    expect(checkWinner(state)).toBe('player1');
  });

  it('hasValidMoves reflects dice and ownership', () => {
    expect(hasValidMoves(createInitialState())).toBe(false);

    let state = withDice(createInitialState(), [2, 3, 4]);
    expect(hasValidMoves(state)).toBe(true);

    // Occupy every reachable result
    const results = getValidPlacements(state, [2, 3, 4]).map((p) => p.result);
    state = claimCells(state, results, 'player2');
    expect(hasValidMoves(state)).toBe(false);
  });

  it('placeChip ends game on five-in-a-row', () => {
    let state = claimCells(createInitialState(), [1, 2, 3, 4], 'player1');
    state = withDice(state, [1, 2, 3]);
    const next = placeChip(state, 5, '1+2+2');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
