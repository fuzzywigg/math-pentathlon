/**
 * Wave 54 leftover after #240 — Pinball nonzero score values. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — score values', () => {
  it('surfaces mutated seat scores', () => {
    const s = createInitialState();
    const el = renderScores({
      ...s,
      player1Stats: { ...s.player1Stats, score: 120 },
      player2Stats: { ...s.player2Stats, score: 45 },
    });
    const vals = [...el.querySelectorAll('.pinball-score-value')].map(
      (n) => n.textContent
    );
    expect(vals).toEqual(['120', '45']);
  });
});
