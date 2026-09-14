/**
 * Wave 43 — commitSelection wrong phase leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { commitSelection } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hag — commit wrong phase', () => {
  it('commit in placeBlocks/gameOver is identity', () => {
    const place = { ...createInitialState(), phase: 'placeBlocks' as const };
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      turnSelection: { blocks: ['triangle' as const], committed: true },
    };
    expect(commitSelection(place)).toBe(place);
    expect(commitSelection(over)).toBe(over);
  });

  it('commit with empty selection is identity', () => {
    const s = createInitialState();
    expect(commitSelection(s)).toBe(s);
  });
});
