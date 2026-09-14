/**
 * Wave 55 leftover after #250 — Hex-a-Gone executeAITurn starting in placeBlocks. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { executeAITurn } from '../../src/games/hex-a-gone/ai';

describe('Wave 55 hexagone — execute from place', () => {
  it('places committed triangle without re-selecting', () => {
    const placing = commitSelection(selectBlock(createInitialState(), 'triangle'));
    const next = executeAITurn(placing, 'player1', 'medium');
    expect(next.placedBlocks.length).toBeGreaterThanOrEqual(1);
    expect(['selectBlocks', 'gameOver']).toContain(next.phase);
    expect(next.turnSelection.blocks).toEqual([]);
  });
});
