/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact final-name Blue/Red.
 * Wave57 locked stats bullet; names unasserted. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 58 frac board — final names', () => {
  it('renders .frac-final-name Blue and Red leftovers', () => {
    const el = renderGameOver({
      ...createInitialState('easy'),
      phase: 'gameOver',
      winner: 'player1',
    });
    const names = [...el.querySelectorAll('.frac-final-name')].map(
      (n) => n.textContent
    );
    expect(names).toEqual(['Blue', 'Red']);
  });
});
