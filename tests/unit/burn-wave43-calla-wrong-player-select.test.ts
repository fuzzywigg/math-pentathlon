/**
 * Wave 43 — Calla canSelectPit wrong player matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/calla/types';
import { canSelectPit } from '../../src/games/calla/rules';

describe('Wave 43 calla — wrong player select', () => {
  it('only current player can select non-empty pits', () => {
    const s = createInitialState();
    for (let i = 0; i < 5; i++) {
      expect(canSelectPit(s, 'player1', i)).toBe(true);
      expect(canSelectPit(s, 'player2', i)).toBe(false);
    }
    const p2 = { ...s, currentPlayer: 'player2' as const };
    for (let i = 0; i < 5; i++) {
      expect(canSelectPit(p2, 'player2', i)).toBe(true);
      expect(canSelectPit(p2, 'player1', i)).toBe(false);
    }
  });
});
