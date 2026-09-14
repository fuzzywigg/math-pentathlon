/**
 * Wave 54 leftover after #240 — Pinball empty balls when drained. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — drained balls', () => {
  it('renders empty ball rows at zero remaining', () => {
    const s = createInitialState();
    const el = renderScores({
      ...s,
      player1Stats: { ...s.player1Stats, ballsRemaining: 0 },
      player2Stats: { ...s.player2Stats, ballsRemaining: 0 },
    });
    expect(
      el.querySelector('.pinball-player-score.player1 .pinball-balls')
        ?.textContent
    ).toBe('');
    expect(
      el.querySelector('.pinball-player-score.player2 .pinball-balls')
        ?.textContent
    ).toBe('');
  });
});
