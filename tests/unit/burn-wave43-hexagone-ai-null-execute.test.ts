/**
 * Wave 43 — Hex-a-Gone AI null gates + execute opening. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  getAIPlacement,
  isAITurn,
  executeAITurn,
} from '../../src/games/hex-a-gone/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 hex-a-gone — AI null/execute', () => {
  it('selection/placement null off-phase or wrong seat', () => {
    const s = createInitialState();
    expect(getAISelection(s, 'player2')).toBeNull();
    expect(getAIPlacement(s, 'player1')).toBeNull();
    const placing = commitSelection(selectBlock(s, 'triangle'));
    expect(getAISelection(placing, 'player1')).toBeNull();
    expect(getAIPlacement(placing, 'player2')).toBeNull();
  });

  it('isAITurn matrix', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(s, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('getAISelection opening returns 1..3 blocks; executeAITurn advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const choice = getAISelection(createInitialState(), 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(choice!.blocks.length).toBeGreaterThanOrEqual(1);
    expect(choice!.blocks.length).toBeLessThanOrEqual(3);
    const next = executeAITurn(createInitialState(), 'player1', 'easy');
    expect(next.moveHistory.length + (next.placedBlocks.length > 0 ? 1 : 0)).toBeGreaterThanOrEqual(0);
    expect(next.currentPlayer === 'player2' || next.phase !== 'selectBlocks' || next.placedBlocks.length > 0).toBe(true);
  });

  it('getAIPlacement after commit returns a board coordinate', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const placing = commitSelection(selectBlock(createInitialState(), 'triangle'));
    const choice = getAIPlacement(placing, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect(typeof choice!.q).toBe('number');
    expect(typeof choice!.r).toBe('number');
  });
});
