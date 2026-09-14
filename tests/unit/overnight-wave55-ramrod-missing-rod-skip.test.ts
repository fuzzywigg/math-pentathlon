/**
 * Wave 55 leftover after #250 — Ramrod renderPlayerRods skips unknown rod ids.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderPlayerRods } from '../../src/games/ramrod/board-ui';

describe('Wave 55 ramrod — missing rod skip', () => {
  it('does not mount a wrapper for a phantom rod id', () => {
    const s = createInitialState();
    const el = renderPlayerRods(
      {
        ...s,
        playerRods: {
          ...s.playerRods,
          player1: [...s.playerRods.player1, 'missing-rod-id'],
        },
      },
      'player1',
      () => undefined
    );
    expect(el.querySelectorAll('.ramrod-rod-wrapper').length).toBe(
      s.playerRods.player1.length
    );
  });
});
