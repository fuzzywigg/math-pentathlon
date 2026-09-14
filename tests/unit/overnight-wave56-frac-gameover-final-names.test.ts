/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact final-name Blue/Red.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — final names', () => {
  it('final-name nodes are Blue then Red leftover', () => {
    const el = renderGameOver({
      ...createInitialState('medium'),
      phase: 'gameOver',
      winner: 'player1',
    });
    const names = [...el.querySelectorAll('.frac-final-name')].map(
      (n) => n.textContent
    );
    expect(names).toEqual(['Blue', 'Red']);
  });
});
