/**
 * Overnight HEAVY leftover — Calla status winner chrome HvH vs HvA.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Overnight wave50 calla — status winners', () => {
  it('names Blue/Red in HvH and You/AI in HvA, including live region', () => {
    const hvhP1 = document.createElement('div');
    renderStatus(
      { ...createInitialState(), winner: 'player1', phase: 'gameOver' },
      hvhP1,
      'human-vs-human'
    );
    expect(hvhP1.getAttribute('aria-live')).toBe('polite');
    expect(hvhP1.textContent).toMatch(/Blue Wins/i);
    expect(hvhP1.querySelector('.status-winner')).toBeTruthy();

    const hvhP2 = document.createElement('div');
    renderStatus(
      { ...createInitialState(), winner: 'player2', phase: 'gameOver' },
      hvhP2
    );
    expect(hvhP2.textContent).toMatch(/Red Wins/i);

    const hvaYou = document.createElement('div');
    renderStatus(
      { ...createInitialState(), winner: 'player1', phase: 'gameOver' },
      hvaYou,
      'human-vs-ai'
    );
    expect(hvaYou.textContent).toMatch(/You Wins/i);

    const hvaAi = document.createElement('div');
    renderStatus(
      { ...createInitialState(), winner: 'player2', phase: 'gameOver' },
      hvaAi,
      'human-vs-ai'
    );
    expect(hvaAi.textContent).toMatch(/AI Wins/i);
    expect(hvaAi.textContent).toMatch(/You:/);
    expect(hvaAi.textContent).toMatch(/AI:/);
  });
});
