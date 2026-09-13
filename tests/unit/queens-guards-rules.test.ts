import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cellKey,
  isMoveValid,
  CONFIG,
  type QueensGuardsState,
  type HexCell,
  type Piece,
} from '../../src/games/queens-guards/types';
import {
  getValidMoves,
  makeMove,
  selectPiece,
  checkWinner,
} from '../../src/games/queens-guards/rules';

function emptyCells(): Map<string, HexCell> {
  const cells = new Map<string, HexCell>();
  for (let ring = 0; ring < CONFIG.NUM_RINGS; ring++) {
    const count = ring === 0 ? 1 : 6 * ring;
    for (let pos = 0; pos < count; pos++) {
      cells.set(cellKey(ring, pos), {
        ring,
        position: pos,
        piece: null,
      });
    }
  }
  return cells;
}

function place(
  cells: Map<string, HexCell>,
  ring: number,
  position: number,
  piece: Piece
): void {
  const cell = cells.get(cellKey(ring, position));
  if (cell) cell.piece = piece;
}

describe('Queens & Guards – createInitialState', () => {
  it('starts with player1, empty selection, and pieces on the outer ring', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedPiece).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.moveHistory).toHaveLength(0);

    const outer = CONFIG.NUM_RINGS - 1;
    const queen = state.cells.get(cellKey(outer, 7));
    expect(queen?.piece?.type).toBe('queen');
    expect(queen?.piece?.player).toBe('player1');
  });
});

describe('Queens & Guards – isMoveValid', () => {
  it('allows sideways and inward moves but not outward', () => {
    expect(isMoveValid({ ring: 3, position: 0 }, { ring: 3, position: 1 })).toBe(
      true
    );
    expect(isMoveValid({ ring: 3, position: 0 }, { ring: 2, position: 0 })).toBe(
      true
    );
    expect(isMoveValid({ ring: 3, position: 0 }, { ring: 4, position: 0 })).toBe(
      false
    );
  });
});

describe('Queens & Guards – getValidMoves / selectPiece / makeMove', () => {
  it('returns sideways moves for a guard on the outer ring', () => {
    const state = createInitialState();
    // Player1 guard at outer odd position (e.g. 1) should have empty neighbors
    const from = { ring: 5, position: 1 };
    const moves = getValidMoves(state, from);
    expect(moves.length).toBeGreaterThan(0);
    expect(moves.every((m) => m.ring <= from.ring)).toBe(true);
  });

  it('selectPiece toggles selection for movable own pieces', () => {
    const state = createInitialState();
    const from = { ring: 5, position: 1 };
    const selected = selectPiece(state, from);
    expect(selected.selectedPiece).toBe(cellKey(5, 1));

    const cleared = selectPiece(selected, from);
    expect(cleared.selectedPiece).toBeNull();
  });

  it('selectPiece ignores opponent pieces', () => {
    const state = createInitialState();
    const next = selectPiece(state, { ring: 5, position: 22 });
    expect(next.selectedPiece).toBeNull();
  });

  it('makeMove relocates a piece and flips the turn when no capture', () => {
    const state = createInitialState();
    const from = { ring: 5, position: 1 };
    const moves = getValidMoves(state, from);
    expect(moves.length).toBeGreaterThan(0);
    const to = moves[0];

    const next = makeMove(state, from, to);
    expect(next.cells.get(cellKey(from.ring, from.position))?.piece).toBeNull();
    expect(next.cells.get(cellKey(to.ring, to.position))?.piece?.player).toBe(
      'player1'
    );
    expect(next.moveHistory).toHaveLength(1);
    if (next.capturedPieces.length === 0) {
      expect(next.currentPlayer).toBe('player2');
    }
  });

  it('makeMove is a no-op for illegal destinations', () => {
    const state = createInitialState();
    const from = { ring: 5, position: 1 };
    const next = makeMove(state, from, { ring: 0, position: 0 });
    expect(next).toBe(state);
  });
});

describe('Queens & Guards – checkWinner', () => {
  it('detects throne win when queen sits in center with six own guards', () => {
    const cells = emptyCells();
    place(cells, 0, 0, {
      id: 'p1-queen',
      player: 'player1',
      type: 'queen',
    });
    for (let pos = 0; pos < 6; pos++) {
      place(cells, 1, pos, {
        id: `p1-guard-${pos}`,
        player: 'player1',
        type: 'guard',
      });
    }

    const state: QueensGuardsState = {
      cells,
      currentPlayer: 'player1',
      selectedPiece: null,
      capturedPieces: [],
      winner: null,
      moveHistory: [],
    };

    expect(checkWinner(state)).toBe('player1');
  });

  it('returns null when center is empty or guards incomplete', () => {
    expect(checkWinner(createInitialState())).toBeNull();

    const cells = emptyCells();
    place(cells, 0, 0, {
      id: 'p1-queen',
      player: 'player1',
      type: 'queen',
    });
    place(cells, 1, 0, {
      id: 'p1-guard-0',
      player: 'player1',
      type: 'guard',
    });
    const partial: QueensGuardsState = {
      cells,
      currentPlayer: 'player1',
      selectedPiece: null,
      capturedPieces: [],
      winner: null,
      moveHistory: [],
    };
    expect(checkWinner(partial)).toBeNull();
  });
});
