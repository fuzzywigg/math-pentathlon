/**
 * Overnight TOKENMAXX — Hex-a-Gone empty bank AI leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, type BlockShape } from '../../src/games/hex-a-gone/types';
import { getAISelection } from '../../src/games/hex-a-gone/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight hexagone — empty bank AI', () => {
  it('all-zero bank yields empty blocks selection', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const shapes = Object.keys(s.bank) as BlockShape[];
    for (const sh of shapes) s.bank[sh] = 0;
    const sel = getAISelection(s, 'player1', 'easy');
    expect(sel).not.toBeNull();
    expect(sel!.blocks).toEqual([]);
  });
});
