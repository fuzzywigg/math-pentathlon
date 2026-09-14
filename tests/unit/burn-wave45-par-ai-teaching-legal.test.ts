/**
 * Wave 45 TOKENMAXX — Par-55 easy teaching getAIMove legal leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { getAIMove } from '../../src/games/par-55/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 45 par55 — teaching AI legal', () => {
  it('easy getAIMove stays legal under teaching randomness', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const open = createInitialState();
    const m = getAIMove(open, 'player1', 'easy');
    expect(m).not.toBeNull();
    expect(open.hands.player1.some((b) => b.id === m!.blockId)).toBe(true);
    expect(open.bases.has(m!.baseId)).toBe(true);
  });
});
