/**
 * Wave 35 — Hex-a-Gone mutual stuck passTurn settle + canPlaceAt edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BlockShape } from '../../src/games/hex-a-gone/types';
import {
  passTurn,
  canPlayerMove,
  canPlaceAt,
  getValidPlacements,
  isGameOver,
  getBlockColor,
} from '../../src/games/hex-a-gone/rules';
import { getAISelection, getAIPlacement, isAITurn } from '../../src/games/hex-a-gone/ai';

describe('Wave 35 Hex-a-Gone — mutual stuck settle', () => {
  it('passTurn when board full → gameOver with winner', () => {
    const state = createInitialState();
    for (const cell of state.board) {
      cell.filled = true;
    }
    expect(canPlayerMove(state)).toBe(false);
    const next = passTurn(state);
    expect(next.phase).toBe('gameOver');
    expect(isGameOver(next)).toBe(true);
    expect(next.winner).toBeTruthy();
  });

  it('passTurn identity when blocks already selected', () => {
    const state = createInitialState();
    const withSel = {
      ...state,
      turnSelection: {
        ...state.turnSelection,
        blocks: ['hexagon' as BlockShape],
      },
    };
    expect(passTurn(withSel)).toBe(withSel);
  });

  it('canPlaceAt false for filled / missing coords', () => {
    const state = createInitialState();
    const cell = state.board[0];
    cell.filled = true;
    expect(canPlaceAt(state, cell.q, cell.r)).toBe(false);
    expect(canPlaceAt(state, 999, 999)).toBe(false);
  });

  it('getValidPlacements empty without selectedBlockForPlacement', () => {
    expect(getValidPlacements(createInitialState())).toEqual([]);
  });

  it('AI selection null on gameOver; placement null when full; hvh gate', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAISelection(over, 'player1', 'hard')).toBeNull();
    const full = createInitialState();
    for (const cell of full.board) cell.filled = true;
    const placing = {
      ...full,
      phase: 'placeBlocks' as const,
      selectedBlockForPlacement: 'triangle' as BlockShape,
    };
    expect(getAIPlacement(placing, 'player1', 'hard')).toBeNull();
    expect(isAITurn(createInitialState(), 'player1', 'human-vs-human')).toBe(false);
  });

  it('getBlockColor returns string for known shapes', () => {
    for (const shape of ['hexagon', 'triangle', 'square', 'trapezoid', 'rhombus'] as BlockShape[]) {
      expect(typeof getBlockColor(shape)).toBe('string');
      expect(getBlockColor(shape).length).toBeGreaterThan(0);
    }
  });
});
