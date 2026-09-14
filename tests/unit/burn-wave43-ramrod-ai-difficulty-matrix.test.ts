/**
 * Wave 43 — ramrod AI difficulty matrix leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, isValidPlacement } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';

describe('Wave 43 ramrod — AI difficulty matrix', () => {
  it('easy/medium/hard return legal rod/box/slot', () => {
    const s = createInitialState();
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(s, 'player1', d);
      expect(move).not.toBeNull();
      expect(
        isValidPlacement(s, move!.rodId, move!.boxId, move!.slot)
      ).toBe(true);
    }
  });
});
