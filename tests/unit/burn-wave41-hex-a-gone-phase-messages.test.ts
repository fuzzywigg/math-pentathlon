/**
 * Wave 41 — Hex-a-Gone getPhaseMessage / getBlockColor / isGameOver leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  BLOCK_COLORS,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  getPhaseMessage,
  getBlockColor,
  isGameOver,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 41 hex-a-gone — phase messages / colors / gameOver', () => {
  it('getPhaseMessage covers select empty, select with count, place, and gameOver', () => {
    const open = createInitialState();
    expect(getPhaseMessage(open)).toContain('Select 1-3 blocks');
    expect(getPhaseMessage(open)).toContain('Blue');

    let state = selectBlock(open, 'hexagon');
    expect(getPhaseMessage(state)).toContain('1 block(s) selected');

    state = selectBlock(state, 'triangle');
    expect(getPhaseMessage(state)).toContain('2 block(s) selected');

    state = commitSelection(state);
    expect(getPhaseMessage(state)).toContain('Place your blocks');
    expect(getPhaseMessage(state)).toContain('2 remaining');

    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    expect(getPhaseMessage(over)).toBe('Red wins!');

    const blueWin = { ...over, winner: 'player1' as const };
    expect(getPhaseMessage(blueWin)).toBe('Blue wins!');
  });

  it('getPhaseMessage uses Red for player2 select phase', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
    };
    expect(getPhaseMessage(state)).toContain("Red's turn");
  });

  it('getBlockColor matches BLOCK_COLORS for every shape', () => {
    const shapes = Object.keys(BLOCK_COLORS) as BlockShape[];
    for (const shape of shapes) {
      expect(getBlockColor(shape)).toBe(BLOCK_COLORS[shape]);
      expect(getBlockColor(shape).startsWith('#')).toBe(true);
    }
  });

  it('isGameOver true when phase gameOver or winner set', () => {
    expect(isGameOver(createInitialState())).toBe(false);
    expect(
      isGameOver({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
      })
    ).toBe(true);
    expect(
      isGameOver({
        ...createInitialState(),
        phase: 'selectBlocks',
        winner: 'player2',
      })
    ).toBe(true);
  });
});
