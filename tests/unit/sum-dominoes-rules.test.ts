import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  CONFIG,
  createDominoSet,
  getDiceSum,
  getDominoPips,
  isDouble,
  getOpponent,
} from '../../src/games/sum-dominoes/types';
import {
  createInitialState,
  doRollDice,
  canPlayDomino,
  isValidPlacement,
  getValidPlacements,
  selectDomino,
  placeDomino,
  passTurn,
  formatMove,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function emptyBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: CONFIG.BOARD_SIZE }, () =>
    Array.from({ length: CONFIG.BOARD_SIZE }, () => null)
  );
}

function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
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

function baseState(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  const board = emptyBoard();
  // Seed center with double-six so adjacency math is predictable
  placeOnBoard(board, makeDomino('seed', 6, 6, null), 5, 5, 'horizontal');

  return {
    board,
    hands: {
      player1: [makeDomino('d-a', 2, 3), makeDomino('d-b', 4, 5)],
      player2: [makeDomino('d-c', 1, 1, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: null,
    selectedDomino: null,
    phase: 'rolling',
    winner: null,
    moveHistory: [],
    passCount: 0,
    ...overrides,
  };
}

describe('Sum Dominoes – types helpers', () => {
  it('createDominoSet yields 28 unique double-six tiles', () => {
    const set = createDominoSet();
    expect(set).toHaveLength(28);
    const ids = new Set(set.map((d) => d.id));
    expect(ids.size).toBe(28);
    expect(set.some((d) => d.face1 === 6 && d.face2 === 6)).toBe(true);
    expect(set.some((d) => d.face1 === 0 && d.face2 === 0)).toBe(true);
  });

  it('pip / double / opponent helpers', () => {
    const d = makeDomino('x', 3, 5);
    expect(getDominoPips(d)).toBe(8);
    expect(isDouble(makeDomino('y', 4, 4))).toBe(true);
    expect(isDouble(d)).toBe(false);
    expect(getOpponent('player1')).toBe('player2');
    expect(getDiceSum([3, 4])).toBe(7);
  });
});

describe('Sum Dominoes – createInitialState', () => {
  it('deals 7 tiles each and seeds center', () => {
    const state = createInitialState();
    expect(state.hands.player1).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(state.hands.player2).toHaveLength(CONFIG.STARTING_HAND_SIZE);
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player1');
    expect(state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]).not.toBeNull();
    expect(state.winner).toBeNull();
  });
});

describe('Sum Dominoes – rolling / validation', () => {
  it('doRollDice moves to placing when a play exists', () => {
    // sum = 8 → 2+6 match against center sixes with face 2
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.5) // die1 → 4? floor(0.5*6)+1 = 4
      .mockReturnValueOnce(0.5); // die2 → 4; sum 8
    // Actually 0.5*6 = 3 → floor 3 + 1 = 4. Yes sum 8.
    const state = baseState({
      hands: {
        player1: [makeDomino('playable', 2, 0)],
        player2: [],
      },
    });
    const next = doRollDice(state);
    expect(next.currentDice).toEqual([4, 4]);
    expect(next.phase).toBe('placing');
  });

  it('doRollDice moves to passing when nothing matches', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // [1,1] sum 2
    const state = baseState({
      hands: {
        player1: [makeDomino('high', 5, 5)], // needs adjacent 5 for sum 10 only from 5+5
        player2: [],
      },
    });
    // Center is 6|6; face 5 + 6 = 11 ≠ 2 → cannot play
    const next = doRollDice(state);
    expect(next.phase).toBe('passing');
  });

  it('is a no-op outside rolling', () => {
    const state = baseState({ phase: 'placing', currentDice: [2, 2] });
    expect(doRollDice(state)).toBe(state);
  });

  it('isValidPlacement requires adjacency sum match and empty cells', () => {
    const state = baseState();
    const domino = makeDomino('m', 2, 3);

    // Horizontal left of center: cell (5,4)-(5,5) but (5,5) occupied → false
    expect(
      isValidPlacement(state, domino, { row: 5, col: 4 }, 'horizontal', 8)
    ).toBe(false);

    // Place above center with face2 adjacent? vertical at (3,5): faces at (3,5)=2,(4,5)=3
    // Adjacent to seed at (5,5)=6: need 3+6=9 → sum 9
    expect(
      isValidPlacement(state, domino, { row: 3, col: 5 }, 'vertical', 9)
    ).toBe(true);

    expect(
      isValidPlacement(state, domino, { row: 3, col: 5 }, 'vertical', 8)
    ).toBe(false);

    // Out of bounds
    expect(
      isValidPlacement(state, domino, { row: 0, col: 10 }, 'horizontal', 8)
    ).toBe(false);
  });

  it('getValidPlacements / canPlayDomino agree', () => {
    const state = baseState();
    const domino = makeDomino('m', 2, 3);
    const placements = getValidPlacements(state, domino, 8);
    // 2+6=8 → placements that put face 2 against a six
    expect(placements.length).toBeGreaterThan(0);
    expect(canPlayDomino(state, domino, 8)).toBe(true);
    expect(canPlayDomino(state, makeDomino('z', 0, 0), 8)).toBe(false);
  });
});

describe('Sum Dominoes – select / place / pass / win', () => {
  it('selectDomino only for playable tiles in placing phase', () => {
    const state = baseState({
      phase: 'placing',
      currentDice: [4, 4], // sum 8
      hands: {
        player1: [makeDomino('ok', 2, 1), makeDomino('no', 0, 0)],
        player2: [],
      },
    });

    expect(selectDomino(state, 'missing')).toBe(state);
    expect(selectDomino(state, 'no')).toBe(state);
    const selected = selectDomino(state, 'ok');
    expect(selected.selectedDomino).toBe('ok');
  });

  it('placeDomino updates board, removes from hand, resets passCount', () => {
    let state = baseState({
      phase: 'placing',
      currentDice: [4, 4],
      selectedDomino: 'ok',
      passCount: 1,
      hands: {
        player1: [makeDomino('ok', 2, 1), makeDomino('keep', 3, 3)],
        player2: [makeDomino('p2', 1, 2, 'player2')],
      },
    });

    const placements = getValidPlacements(
      state,
      state.hands.player1[0],
      8
    );
    expect(placements.length).toBeGreaterThan(0);
    const { position, orientation } = placements[0];

    state = placeDomino(state, position, orientation);
    expect(state.hands.player1).toHaveLength(1);
    expect(state.hands.player1[0].id).toBe('keep');
    expect(state.board[position.row][position.col]).not.toBeNull();
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player2');
    expect(state.passCount).toBe(0);
    expect(state.moveHistory).toHaveLength(1);
    expect(formatMove(state.moveHistory[0])).toContain('[2|1]');
  });

  it('emptying hand wins immediately', () => {
    let state = baseState({
      phase: 'placing',
      currentDice: [4, 4],
      selectedDomino: 'last',
      hands: {
        player1: [makeDomino('last', 2, 1)],
        player2: [makeDomino('p2', 5, 5, 'player2')],
      },
    });
    const { position, orientation } = getValidPlacements(
      state,
      state.hands.player1[0],
      8
    )[0];

    state = placeDomino(state, position, orientation);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
    expect(getRemainingCount(state, 'player1')).toBe(0);
  });

  it('two consecutive passes end game by lowest remaining pips', () => {
    const state = baseState({
      phase: 'passing',
      passCount: 1,
      hands: {
        player1: [makeDomino('a', 1, 1)], // 2 pips
        player2: [makeDomino('b', 6, 6, 'player2')], // 12 pips
      },
    });

    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('single pass swaps players without ending', () => {
    const state = baseState({ phase: 'passing', passCount: 0 });
    const next = passTurn(state);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.passCount).toBe(1);
  });

  it('passTurn is no-op outside passing phase', () => {
    const state = baseState({ phase: 'rolling' });
    expect(passTurn(state)).toBe(state);
  });

  it('tied pip counts produce a draw (null winner)', () => {
    const state = baseState({
      phase: 'passing',
      passCount: 1,
      hands: {
        player1: [makeDomino('a', 3, 3)],
        player2: [makeDomino('b', 2, 4, 'player2')],
      },
    });
    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
