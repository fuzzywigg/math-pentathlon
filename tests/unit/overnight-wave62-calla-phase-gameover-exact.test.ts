/**
 * Wave 62 leftover after #293 — Calla getPhaseMessage gameOver exact strings.
 * Tightens soft /tie|wins/ matches. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getPhaseMessage } from '../../src/games/calla/rules';

describe('Wave 62 calla — phase gameover exact', () => {
  it('locks tie / Blue wins / Red wins phase copy', () => {
    expect(
      getPhaseMessage({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'tie',
      })
    ).toBe("It's a tie!");
    expect(
      getPhaseMessage({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
      })
    ).toBe('Blue wins!');
    expect(
      getPhaseMessage({
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player2',
      })
    ).toBe('Red wins!');
  });
});
