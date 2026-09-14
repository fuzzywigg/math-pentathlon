/**
 * Wave 41 — Hex-a-Gone getPhaseMessage / passTurn / canPlayerMove.
 * Phase strings + pass identity / stuck settle. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  type HexAGoneGameState,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  getPhaseMessage,
  passTurn,
  canPlayerMove,
  isGameOver,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 41 hex-a-gone — phase msg / pass / canMove', () => {
  it('getPhaseMessage matrix across phases', () => {
    const open = createInitialState();
    expect(getPhaseMessage(open)).toMatch(/Blue.*Select 1-3/i);

    const one = selectBlock(open, 'triangle');
    expect(getPhaseMessage(one)).toMatch(/1 block\(s\) selected/i);

    const placing: HexAGoneGameState = {
      ...one,
      phase: 'placeBlocks',
      turnSelection: { blocks: ['triangle', 'square'], committed: true },
    };
    expect(getPhaseMessage(placing)).toMatch(/Place your blocks.*2 remaining/i);

    expect(
      getPhaseMessage({
        ...open,
        phase: 'gameOver',
        winner: 'player2',
      })
    ).toMatch(/Red wins/);
  });

  it('passTurn identity when blocks already selected or gameOver', () => {
    const withSel = selectBlock(createInitialState(), 'hexagon');
    expect(passTurn(withSel)).toBe(withSel);
    const over: HexAGoneGameState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
    };
    expect(passTurn(over)).toBe(over);
  });

  it('passTurn flips seat when opponent can still move', () => {
    const next = passTurn(createInitialState());
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectBlocks');
    expect(isGameOver(next)).toBe(false);
  });

  it('canPlayerMove false when bank empty or board full', () => {
    expect(canPlayerMove(createInitialState())).toBe(true);

    const emptyBank: HexAGoneGameState = {
      ...createInitialState(),
      bank: {
        hexagon: 0,
        trapezoid: 0,
        rhombus: 0,
        triangle: 0,
        square: 0,
      },
    };
    expect(canPlayerMove(emptyBank)).toBe(false);

    const full = createInitialState();
    for (const cell of full.board) cell.filled = true;
    expect(canPlayerMove(full)).toBe(false);
  });

  it('passTurn on full board settles gameOver with winner', () => {
    const full = createInitialState();
    for (const cell of full.board) cell.filled = true;
    const next = passTurn(full);
    expect(next.phase).toBe('gameOver');
    expect(isGameOver(next)).toBe(true);
    expect(next.winner).toBeTruthy();
  });
});
