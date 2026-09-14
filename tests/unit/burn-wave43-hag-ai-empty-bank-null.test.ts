/**
 * Wave 43 — empty bank AI selection leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';
import { getAISelection, executeAITurn } from '../../src/games/hex-a-gone/ai';

describe('Wave 43 hag — AI empty bank', () => {
  it('all bank 0 → empty blocks selection; execute stays selectBlocks', () => {
    const bank = {
      hexagon: 0,
      trapezoid: 0,
      rhombus: 0,
      triangle: 0,
      square: 0,
    } as Record<BlockShape, number>;
    const s = { ...createInitialState(), bank };
    const sel = getAISelection(s, 'player1', 'hard');
    expect(sel).not.toBeNull();
    expect(sel!.blocks).toEqual([]);
    const next = executeAITurn(s, 'player1', 'hard');
    expect(next.phase).toBe('selectBlocks');
    expect(next.turnSelection.blocks).toEqual([]);
  });
});
