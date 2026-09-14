/**
 * Wave 54 leftover after #240 — Pinball game-over pts suffix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — gameover pts', () => {
  it('suffixes scores with pts', () => {
    const s = createInitialState();
    const el = renderGameOver({
      ...s,
      winner: 'player2',
      player1Stats: { ...s.player1Stats, score: 80 },
      player2Stats: { ...s.player2Stats, score: 110 },
    });
    const vals = [...el.querySelectorAll('.pinball-final-value')].map(
      (n) => n.textContent
    );
    expect(vals).toEqual(['80 pts', '110 pts']);
  });
});
