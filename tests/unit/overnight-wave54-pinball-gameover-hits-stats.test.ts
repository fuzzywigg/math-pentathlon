/**
 * Wave 54 leftover after #240 — Pinball game-over hits stats. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderGameOver } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — gameover hits', () => {
  it('shows correctAnswers as hits per seat', () => {
    const s = createInitialState();
    const el = renderGameOver({
      ...s,
      winner: 'player1',
      player1Stats: { ...s.player1Stats, correctAnswers: 4 },
      player2Stats: { ...s.player2Stats, correctAnswers: 1 },
    });
    const stats = [...el.querySelectorAll('.pinball-final-stats')].map((n) =>
      n.textContent?.trim()
    );
    expect(stats).toEqual(['4 hits', '1 hits']);
  });
});
