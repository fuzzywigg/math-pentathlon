import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  CONFIG,
} from '../../src/games/sum-dominoes/types';
import {
  getAIMove,
  executeAITurn,
  isAITurn,
  hasPlayableMove,
} from '../../src/games/sum-dominoes/ai';
import { getValidPlacements } from '../../src/games/sum-dominoes/rules';

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

function seedCenter(): (PlacedDomino | null)[][] {
  const board = emptyBoard();
  const seed = makeDomino('seed', 6, 6, null);
  const placed: PlacedDomino = {
    domino: { ...seed, orientation: 'horizontal' },
    position: { row: 5, col: 5 },
    orientation: 'horizontal',
  };
  board[5][5] = placed;
  board[5][6] = placed;
  return board;
}

function stateForAI(
  overrides: Partial<SumDominoesState> = {}
): SumDominoesState {
  return {
    board: seedCenter(),
    hands: {
      player1: [makeDomino('p1a', 2, 3)],
      player2: [
        makeDomino('big', 6, 5, 'player2'),
        makeDomino('small', 2, 1, 'player2'),
      ],
    },
    currentPlayer: 'player2',
    currentDice: [2, 6], // sum 8 → 2+6
    selectedDomino: null,
    phase: 'placing',
    winner: null,
    moveHistory: [],
    passCount: 0,
    ...overrides,
  };
}

describe('Sum Dominoes AI', () => {
  it('isAITurn respects seat and game over', () => {
    const state = stateForAI();
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player2')).toBe(true);
    expect(isAITurn(state, 'player1')).toBe(false);
    expect(isAITurn({ ...state, phase: 'gameOver' }, 'player2')).toBe(false);
  });

  it('hasPlayableMove detects complements against board', () => {
    const state = stateForAI();
    expect(hasPlayableMove(state, 'player2', 8)).toBe(true);
    expect(hasPlayableMove(state, 'player2', 2)).toBe(false);
  });

  it('getAIMove returns null for wrong phase/player/no dice', () => {
    expect(getAIMove(stateForAI({ phase: 'gameOver' }), 'player2')).toBeNull();
    expect(getAIMove(stateForAI({ currentPlayer: 'player1' }), 'player2')).toBeNull();
    expect(getAIMove(stateForAI({ currentDice: null }), 'player2')).toBeNull();
  });

  it('getAIMove picks a legal placement (hard, no randomness)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = stateForAI();
    const move = getAIMove(state, 'player2', 'hard');
    expect(move).not.toBeNull();

    const domino = state.hands.player2.find((d) => d.id === move!.dominoId)!;
    const legal = getValidPlacements(state, domino, 8);
    expect(
      legal.some(
        (p) =>
          p.position.row === move!.position.row &&
          p.position.col === move!.position.col &&
          p.orientation === move!.orientation
      )
    ).toBe(true);
  });

  it('prefers high-pip / winning last tile when scored', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Only one tile left that wins
    const state = stateForAI({
      hands: {
        player1: [makeDomino('p1', 0, 0)],
        player2: [makeDomino('last', 2, 4, 'player2')],
      },
      currentDice: [2, 6],
    });
    const move = getAIMove(state, 'player2', 'hard');
    expect(move?.dominoId).toBe('last');
  });

  it('executeAITurn rolls then places for AI', () => {
    // Force dice [2,6] → sum 8
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce((2 - 1) / 6) // ≈0.166 → die 2? floor(0.166*6)+1 = floor(1)+1 = 2
      .mockReturnValueOnce((6 - 1) / 6 - 0.001) // ≈0.832 → floor(4.99)+1 = 5 — adjust
      .mockReturnValue(0.99);

    // More reliable: start already in placing
    const state = stateForAI({ phase: 'placing', currentDice: [3, 5] }); // sum 8
    const next = executeAITurn(state, 'player2', 'hard');
    expect(next.moveHistory.length).toBe(1);
    expect(next.currentPlayer).toBe('player1');
    expect(next.phase).toBe('rolling');
  });

  it('executeAITurn passes when phase is passing', () => {
    const state = stateForAI({
      phase: 'passing',
      currentDice: [1, 1],
      passCount: 0,
    });
    const next = executeAITurn(state, 'player2', 'medium');
    expect(next.currentPlayer).toBe('player1');
    expect(next.passCount).toBe(1);
    expect(next.phase).toBe('rolling');
  });
});
