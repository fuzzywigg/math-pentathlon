/**
 * Wave 43 — Hex-a-Gone placeBlock turn complete + pass stuck win. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  canPlaceAt,
  getValidPlacements,
  passTurn,
  canPlayerMove,
  isGameOver,
  getPhaseMessage,
  getBlockColor,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — place/pass/win', () => {
  it('canPlaceAt true on empty; placeBlock fills and switches when turn done', () => {
    let s = commitSelection(selectBlock(createInitialState(), 'triangle'));
    expect(canPlaceAt(s, 0, 0)).toBe(true);
    expect(getValidPlacements(s).length).toBe(s.board.filter((c) => !c.filled).length);
    const next = placeBlock(s, 0, 0);
    expect(next.board.find((c) => c.q === 0 && c.r === 0)?.filled).toBe(true);
    expect(next.bank.triangle).toBe(createInitialState().bank.triangle - 1);
    expect(next.phase).toBe('selectBlocks');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
  });

  it('placeBlock identity when occupied or wrong phase', () => {
    let s = commitSelection(selectBlock(createInitialState(), 'square'));
    s = placeBlock(s, 0, 0);
    // s is now selectBlocks for p2 — cannot place
    expect(placeBlock(s, 1, 0)).toBe(s);
  });

  it('passTurn with selection is identity; empty bank+empty board path canPlayerMove false', () => {
    const withSel = selectBlock(createInitialState(), 'hexagon');
    expect(passTurn(withSel)).toBe(withSel);
    expect(canPlayerMove(createInitialState())).toBe(true);
    const emptyBank = {
      ...createInitialState(),
      bank: { hexagon: 0, trapezoid: 0, rhombus: 0, triangle: 0, square: 0 },
    };
    expect(canPlayerMove(emptyBank)).toBe(false);
  });

  it('pass when opponent also cannot move settles gameOver from lastMove', () => {
    const stuck = {
      ...createInitialState(),
      bank: { hexagon: 0, trapezoid: 0, rhombus: 0, triangle: 0, square: 0 },
      moveHistory: [
        { player: 'player2' as const, blocksPlaced: ['triangle' as const], moveNumber: 1 },
      ],
    };
    const next = passTurn(stuck);
    expect(isGameOver(next)).toBe(true);
    expect(next.winner).toBe('player2');
  });

  it('getPhaseMessage + getBlockColor cover phases/shapes', () => {
    expect(getPhaseMessage(createInitialState())).toMatch(/Select/);
    const sel = selectBlock(createInitialState(), 'hexagon');
    expect(getPhaseMessage(sel)).toMatch(/selected/);
    const place = commitSelection(sel);
    expect(getPhaseMessage(place)).toMatch(/Place/);
    const over = { ...createInitialState(), phase: 'gameOver' as const, winner: 'player1' as const };
    expect(getPhaseMessage(over)).toMatch(/wins/);
    expect(getBlockColor('hexagon')).toMatch(/^#/);
  });
});
