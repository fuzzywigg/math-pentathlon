/**
 * Wave 41 — Hex-a-Gone getBlockColor + isGameOver matrix.
 * Known shape colors / winner-or-phase flags. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  BLOCK_COLORS,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';
import { getBlockColor, isGameOver } from '../../src/games/hex-a-gone/rules';

const SHAPES: BlockShape[] = [
  'hexagon',
  'trapezoid',
  'rhombus',
  'triangle',
  'square',
];

describe('Wave 41 hex-a-gone — color / isGameOver', () => {
  it('getBlockColor matches BLOCK_COLORS for every shape', () => {
    for (const shape of SHAPES) {
      expect(getBlockColor(shape)).toBe(BLOCK_COLORS[shape]);
      expect(getBlockColor(shape).startsWith('#')).toBe(true);
    }
  });

  it('isGameOver false on opening and mid-select', () => {
    expect(isGameOver(createInitialState())).toBe(false);
    expect(
      isGameOver({
        ...createInitialState(),
        phase: 'placeBlocks',
        turnSelection: { blocks: ['triangle'], committed: true },
        selectedBlockForPlacement: 'triangle',
      })
    ).toBe(false);
  });

  it('isGameOver true via phase or winner alone', () => {
    expect(
      isGameOver({
        ...createInitialState(),
        phase: 'gameOver',
        winner: null,
      })
    ).toBe(true);
    expect(
      isGameOver({
        ...createInitialState(),
        phase: 'selectBlocks',
        winner: 'player2',
      })
    ).toBe(true);
    expect(
      isGameOver({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
      })
    ).toBe(true);
  });
});
