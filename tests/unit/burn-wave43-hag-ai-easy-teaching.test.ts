/**
 * Wave 43 — getAISelection easy leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getAISelection } from '../../src/games/hex-a-gone/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 hag — AI easy selection', () => {
  it('easy selection returns 1–3 bank shapes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const sel = getAISelection(createInitialState(), 'player1', 'easy');
    expect(sel).not.toBeNull();
    expect(sel!.blocks.length).toBeGreaterThanOrEqual(1);
    expect(sel!.blocks.length).toBeLessThanOrEqual(3);
  });
});
