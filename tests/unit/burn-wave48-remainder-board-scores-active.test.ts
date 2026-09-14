/**
 * Wave 48 — Remainder renderScores active seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderScores } from '../../src/games/remainder-islands/board-ui';

describe('Wave 48 remainder — scores active', () => {
  it('marks current player active and shows turns', () => {
    const s = createInitialState();
    const el = renderScores(s);
    expect(el.querySelector('.remainder-player-score.player1')?.classList.contains('active')).toBe(true);
    expect(el.querySelector('.remainder-turns-value')?.textContent).toBe(String(s.turnsRemaining));
    const p2 = renderScores({ ...s, currentPlayer: 'player2' });
    expect(p2.querySelector('.remainder-player-score.player2')?.classList.contains('active')).toBe(true);
  });
});
