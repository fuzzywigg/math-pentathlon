/**
 * Wave 42 — Pent'Em In canPlacePiece I5 at board edge leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import { canPlacePiece, getPieceCells } from '../../src/games/pent-em-in/rules';

describe('Wave 42 pent-em-in — canPlacePiece I5 edge', () => {
  it('horizontal I5 fits flush against top-left edge on empty board', () => {
    const state = createInitialState();
    expect(canPlacePiece(state, 'I5', { row: 0, col: 0 }, 0, false)).toBe(
      true
    );
    const cells = getPieceCells('I5', { row: 0, col: 0 }, 0, false);
    expect(cells.every((c) => c.row === 0 && c.col >= 0 && c.col < 5)).toBe(
      true
    );
  });

  it('horizontal I5 fits flush against top-right edge', () => {
    const state = createInitialState();
    const col = BOARD_SIZE - 5;
    expect(canPlacePiece(state, 'I5', { row: 0, col }, 0, false)).toBe(true);
  });

  it('vertical I5 fits flush against left edge after 90° rotation', () => {
    const state = createInitialState();
    expect(canPlacePiece(state, 'I5', { row: 0, col: 0 }, 90, false)).toBe(
      true
    );
    const cells = getPieceCells('I5', { row: 0, col: 0 }, 90, false);
    expect(cells.every((c) => c.col === 0 && c.row >= 0 && c.row < 5)).toBe(
      true
    );
  });

  it('I5 one step past edge is rejected', () => {
    const state = createInitialState();
    expect(
      canPlacePiece(state, 'I5', { row: 0, col: BOARD_SIZE - 4 }, 0, false)
    ).toBe(false);
  });
});
