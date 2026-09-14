/**
 * Wave 48 — Pinball renderScores active + round. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 48 pinball — scores', () => {
  it('shows round and active seat', () => {
    const s = createInitialState();
    const el = renderScores(s);
    expect(el.querySelector('.pinball-round-value')?.textContent).toBe(`${s.roundNumber}/${s.maxRounds}`);
    expect(el.querySelector('.pinball-player-score.player1')?.classList.contains('active')).toBe(true);
    const p2 = renderScores({ ...s, currentPlayer: 'player2' });
    expect(p2.querySelector('.pinball-player-score.player2')?.classList.contains('active')).toBe(true);
  });
});
