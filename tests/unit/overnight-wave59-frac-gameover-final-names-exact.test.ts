/**
 * Wave 59 leftover after #272 — Frac Fact .frac-final-name exact.
 * Distinct from winner banner Blue Wins. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 59 frac — final names exact', () => {
  it('renders Blue and Red final-name labels', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const el = renderGameOver(state);
    const names = [...el.querySelectorAll('.frac-final-name')].map(
      (n) => n.textContent
    );
    expect(names).toEqual(['Blue', 'Red']);
  });
});
