import { describe, it, expect } from 'vitest';

import {
  createInitialGameState as createKings,
  endTurn,
  getCurrentPhaseMessage,
  selectKing,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';
import {
  hasSupply,
  getSupply,
  fromOneBasedPosition,
  toOneBasedPosition,
  createInitialBoard,
  BOARD_SIZE,
} from '../../src/games/kings-quadraphages/board';
import { updateBoard } from '../../src/games/kings-quadraphages/board-renderer';
import { INITIAL_QUADRAPHAGE_COUNT } from '../../src/games/kings-quadraphages/pieces';

import {
  createInitialState as createHexAGone,
  getAvailableShapes,
} from '../../src/games/hex-a-gone/types';

import {
  createInitialState as createStar,
  getPlayerPosition,
} from '../../src/games/star-track/types';
import { getProgress } from '../../src/games/star-track/rules';

import {
  createInitialState as createCalla,
  isSideEmpty,
  getSideTotalCubes,
} from '../../src/games/calla/types';

import {
  createFiarBoard,
  getNodesInDirection,
  getDirections,
} from '../../src/games/fiar/types';

import {
  createBlockSet,
  countMatchingAttributes,
} from '../../src/games/par-55/types';

import { isMoveValid } from '../../src/games/queens-guards/types';

describe('Wave 14 — Kings endTurn / phase / board coords / updateBoard', () => {
  it('endTurn flips seat to moveKing when no win/draw', () => {
    const opening = createKings();
    const next = endTurn(opening);
    expect(next.currentPlayer).toBe('player2');
    expect(next.turnPhase).toBe('moveKing');
    expect(next.winner).toBeNull();
  });

  it('selectKing → moveKing → placeQuadraphage advances seat (place ends turn)', () => {
    let state = createKings();
    state = selectKing(state);
    expect(state.selectedKingPosition).toEqual({ row: 1, col: 5 });
    // Destination is 1-based (player1 starts at row 1 / col 5)
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    state = placeQuadraphage(state, { row: 3, col: 3 });
    // placeQuadraphage ends the turn internally
    expect(state.turnPhase).toBe('moveKing');
    expect(state.currentPlayer).toBe('player2');
    expect(state.winner).toBeNull();
    // Explicit endTurn from moveKing phase just flips seat again
    const again = endTurn(state);
    expect(again.currentPlayer).toBe('player1');
    expect(again.turnPhase).toBe('moveKing');
  });

  it('getCurrentPhaseMessage covers opening and gameOver', () => {
    const opening = createKings();
    expect(getCurrentPhaseMessage(opening)).toContain('King');
    const selected = selectKing(opening);
    expect(getCurrentPhaseMessage(selected)).toContain('green');
    const over = {
      ...opening,
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getCurrentPhaseMessage(over)).toContain('Game Over');
    expect(getCurrentPhaseMessage(over)).toContain('Player 1');
  });

  it('hasSupply / getSupply / 1-based position round-trip', () => {
    const state = createKings();
    expect(hasSupply(state, 'player1')).toBe(true);
    expect(getSupply(state, 'player1')).toBe(INITIAL_QUADRAPHAGE_COUNT);
    expect(getSupply(state, 'player2')).toBe(INITIAL_QUADRAPHAGE_COUNT);

    const zero = fromOneBasedPosition(1, 5);
    expect(zero).toEqual({ row: 0, col: 4 });
    expect(toOneBasedPosition(zero)).toEqual({ row: 1, col: 5 });
  });

  it('updateBoard mounts .cell grid and replaces children on re-call', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const board = createInitialBoard();
    updateBoard(container, board);
    expect(container.querySelectorAll('.cell').length).toBe(
      BOARD_SIZE * BOARD_SIZE
    );
    const first = container.firstElementChild;
    updateBoard(container, board);
    expect(container.querySelectorAll('.cell').length).toBe(
      BOARD_SIZE * BOARD_SIZE
    );
    // Children were rebuilt (new first node identity)
    expect(container.firstElementChild).not.toBe(first);
  });
});

describe('Wave 14 — QG move validity / HAG bank / Star progress / Calla empty / FIAR dirs / Par overlap', () => {
  it('isMoveValid same-ring and inward true; outward false', () => {
    expect(
      isMoveValid({ ring: 3, position: 1 }, { ring: 3, position: 2 })
    ).toBe(true);
    expect(
      isMoveValid({ ring: 3, position: 1 }, { ring: 2, position: 0 })
    ).toBe(true);
    expect(
      isMoveValid({ ring: 2, position: 1 }, { ring: 3, position: 1 })
    ).toBe(false);
  });

  it('Hex-a-Gone drained bank excludes shapes from available', () => {
    const state = {
      ...createHexAGone(),
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 0,
        square: 0,
      },
    };
    expect(getAvailableShapes(state)).toEqual([]);
  });

  it('Star getPlayerPosition mirrors fields used by getProgress', () => {
    const state = {
      ...createStar(),
      player1Position: 5,
      player2Position: 2,
    };
    expect(getPlayerPosition(state, 'player1')).toBe(5);
    expect(getPlayerPosition(state, 'player2')).toBe(2);
    expect(getProgress(state, 'player1')).toBeCloseTo((5 / 12) * 100, 5);
    expect(getProgress(state, 'player2')).toBeCloseTo((2 / 12) * 100, 5);
  });

  it('Calla empty side total is 0', () => {
    const state = {
      ...createCalla(),
      player2Pits: [0, 0, 0, 0, 0],
    };
    expect(isSideEmpty(state, 'player2')).toBe(true);
    expect(getSideTotalCubes(state, 'player2')).toBe(0);
  });

  it('FIAR getNodesInDirection from corner follows edge; empty id → []', () => {
    const board = createFiarBoard();
    const dirs = getDirections();
    const right = dirs.find((d) => d.dx > 0 && d.dy === 0)!;
    const chain = getNodesInDirection(board, '0-0', right.dx, right.dy);
    expect(chain.length).toBeGreaterThanOrEqual(1);
    expect(chain[0]).toBe('0-1');
    expect(getNodesInDirection(board, 'nope', right.dx, right.dy)).toEqual([]);
  });

  it('Par countMatchingAttributes partial overlap lists only shared attrs', () => {
    const [a, ...rest] = createBlockSet();
    const partial = rest.find(
      (b) =>
        b.color === a.color &&
        b.size === a.size &&
        b.shape !== a.shape &&
        b.thickness !== a.thickness
    )!;
    expect(countMatchingAttributes(a, partial).sort()).toEqual([
      'color',
      'size',
    ]);
  });
});
