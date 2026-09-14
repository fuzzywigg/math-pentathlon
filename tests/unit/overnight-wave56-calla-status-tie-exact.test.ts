/**
 * Wave 56 leftover after #256 — Calla status tie exact chrome.
 * Distinct from wave50 winner Blue/Red/You/AI matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — status tie exact', () => {
  it('renders emoji tie banner with status-winner class', () => {
    const el = document.createElement('div');
    renderStatus(
      { ...createInitialState(), winner: 'tie', phase: 'gameOver' },
      el
    );
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      "🤝 It's a Tie! 🤝"
    );
    expect(el.querySelector('.status-winner')).toBeTruthy();
    expect(el.getAttribute('aria-live')).toBe('polite');
  });
});
