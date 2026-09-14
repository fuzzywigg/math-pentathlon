/**
 * Wave 59 leftover after #272 — Frac Fact score seat icons exact.
 * Distinct from soft /Blue/ /Red/ matches. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { renderScores } from '../../src/games/frac-fact/board-ui';

describe('Wave 59 frac — scores seat icons', () => {
  it('renders 🔵 Blue and 🔴 Red player name chrome', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.frac-player-name.player1')?.textContent).toBe(
      '🔵 Blue'
    );
    expect(el.querySelector('.frac-player-name.player2')?.textContent).toBe(
      '🔴 Red'
    );
  });
});
