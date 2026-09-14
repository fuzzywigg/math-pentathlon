/**
 * Wave 41 — Sum Dominoes selectDomino reject + passTurn double-pass + format leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  CONFIG,
} from '../../src/games/sum-dominoes/types';
import {
  selectDomino,
  passTurn,
  formatMove,
  getRemainingCount,
} from '../../src/games/sum-dominoes/rules';

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

function base(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  return {
    board: seedCenter(),
    hands: {
      player1: [makeDomino('ok', 2, 1), makeDomino('no', 0, 0)],
      player2: [makeDomino('p2a', 4, 4, 'player2'), makeDomino('p2b', 5, 5, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: [4, 4], // sum 8
    selectedDomino: null,
    phase: 'placing',
    winner: null,
    moveHistory: [],
    passCount: 0,
    ...overrides,
  };
}

describe('Wave 41 Sum Dominoes — selectDomino reject matrix', () => {
  it('identity for wrong phase', () => {
    for (const phase of ['rolling', 'passing', 'gameOver'] as const) {
      const state = base({ phase });
      expect(selectDomino(state, 'ok')).toBe(state);
    }
  });

  it('identity for missing id', () => {
    const state = base();
    expect(selectDomino(state, 'ghost-id')).toBe(state);
  });

  it('identity when currentDice is null', () => {
    const state = base({ currentDice: null });
    expect(selectDomino(state, 'ok')).toBe(state);
  });

  it('identity for unplayable tile id', () => {
    const state = base();
    expect(selectDomino(state, 'no')).toBe(state);
  });

  it('selects playable ok tile', () => {
    const next = selectDomino(base(), 'ok');
    expect(next.selectedDomino).toBe('ok');
    expect(next).not.toBe(base());
  });
});

describe('Wave 41 Sum Dominoes — passTurn double-pass draw path', () => {
  it('first pass swaps seat and increments passCount', () => {
    const state = base({ phase: 'passing', passCount: 0, currentDice: [1, 1] });
    const next = passTurn(state);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.passCount).toBe(1);
    expect(next.currentDice).toBeNull();
  });

  it('second consecutive pass ends by lowest pips', () => {
    const state = base({
      phase: 'passing',
      passCount: 1,
      hands: {
        player1: [makeDomino('low', 1, 0)], // 1 pip
        player2: [makeDomino('high', 6, 6, 'player2')], // 12
      },
    });
    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.passCount).toBe(2);
  });

  it('tied pips on double-pass yield null winner draw', () => {
    const state = base({
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

  it('passTurn identity outside passing', () => {
    expect(passTurn(base({ phase: 'rolling' }))).toEqual(
      passTurn(base({ phase: 'rolling' }))
    );
    const rolling = base({ phase: 'rolling' });
    expect(passTurn(rolling)).toBe(rolling);
  });
});

describe('Wave 41 Sum Dominoes — formatMove + getRemainingCount', () => {
  it('formatMove embeds faces and sum equation', () => {
    const d = makeDomino('f', 2, 5);
    const text = formatMove({
      player: 'player1',
      domino: d,
      position: { row: 4, col: 5 },
      orientation: 'vertical',
      matchedFace: 2,
      adjacentFace: 6,
      diceSum: 8,
      moveNumber: 3,
    });
    expect(text).toBe('[2|5] (2+6=8)');
  });

  it('getRemainingCount mirrors hand lengths after mutation', () => {
    const state = base({
      hands: {
        player1: [makeDomino('a', 1, 1)],
        player2: [
          makeDomino('b', 2, 2, 'player2'),
          makeDomino('c', 3, 3, 'player2'),
          makeDomino('d', 4, 4, 'player2'),
        ],
      },
    });
    expect(getRemainingCount(state, 'player1')).toBe(1);
    expect(getRemainingCount(state, 'player2')).toBe(3);
    const empty = {
      ...state,
      hands: { player1: [], player2: state.hands.player2 },
    };
    expect(getRemainingCount(empty, 'player1')).toBe(0);
  });
});
