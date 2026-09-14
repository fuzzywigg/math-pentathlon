/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact draw banner exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderGameOver } from '../../src/games/frac-fact/board-ui';

describe('Wave 56 frac board — draw exact', () => {
  it('banner text is It\'s a Draw! leftover', () => {
    const el = renderGameOver({
      ...createInitialState('easy'),
      phase: 'gameOver',
      winner: null,
    });
    expect(el.querySelector('.frac-winner-banner')?.textContent).toBe(
      "It's a Draw!"
    );
  });
});
