/**
 * Wave 59 leftover after #279 — Calla HvA You/AI score seat-icon exact HTML.
 * Distinct from wave50 thinking chrome and wave58 winner banners. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 59 calla — hva score you ai exact', () => {
  it('renders You/AI score rows with seat icons', () => {
    const el = document.createElement('div');
    renderStatus(
      { ...createInitialState(), player1Calla: 4, player2Calla: 7 },
      el,
      'human-vs-ai'
    );
    expect(el.querySelector('.calla-score-p1')?.innerHTML).toBe(
      '🔵 You: <strong>4</strong>'
    );
    expect(el.querySelector('.calla-score-p2')?.innerHTML).toBe(
      '🔴 AI: <strong>7</strong>'
    );
  });
});
