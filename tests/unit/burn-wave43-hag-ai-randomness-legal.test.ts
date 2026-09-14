/**
 * Wave 43 — getAIPlacement random legal leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  canPlaceAt,
} from '../../src/games/hex-a-gone/rules';
import { getAIPlacement } from '../../src/games/hex-a-gone/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 hag — AI placement random', () => {
  it('medium placement still empty+on-board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    let s = createInitialState();
    s = selectBlock(s, 'triangle');
    s = commitSelection(s);
    const place = getAIPlacement(s, 'player1', 'medium');
    expect(place).not.toBeNull();
    expect(canPlaceAt(s, place!.q, place!.r)).toBe(true);
  });
});
