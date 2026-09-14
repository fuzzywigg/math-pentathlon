/**
 * Overnight HEAVY leftover — Calla score active class + thinking vs phase.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Overnight wave50 calla — status scores/thinking', () => {
  it('marks the current seat score active and prefers thinking chrome', () => {
    const el = document.createElement('div');
    renderStatus(
      { ...createInitialState(), player1Calla: 2, player2Calla: 5 },
      el
    );
    expect(el.querySelector('.calla-score-p1')?.classList.contains('active')).toBe(
      true
    );
    expect(el.querySelector('.calla-score-p2')?.classList.contains('active')).toBe(
      false
    );
    expect(el.querySelector('.calla-score-p1')?.innerHTML).toMatch(/<strong>2<\/strong>/);
    expect(el.querySelector('.calla-score-p2')?.innerHTML).toMatch(/<strong>5<\/strong>/);

    const thinking = document.createElement('div');
    renderStatus(createInitialState(), thinking, 'human-vs-ai', true);
    expect(thinking.querySelector('.status-turn')?.textContent).toBe(
      '🤖 AI is thinking...'
    );
    expect(thinking.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(thinking.textContent).not.toMatch(/Select a shield/);
  });
});
