/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball final-name Blue/Red.
 * Deepen game-over name labels leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 58 pinball board — final names', () => {
  it('renders .pinball-final-name Blue and Red leftovers', () => {
    const el = renderGameOver({
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
    });
    const names = [...el.querySelectorAll('.pinball-final-name')].map(
      (n) => n.textContent
    );
    expect(names).toEqual(['Blue', 'Red']);
  });
});
