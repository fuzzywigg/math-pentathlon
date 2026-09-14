/**
 * Wave 59 leftover after #279 — Calla HvH score seat-icon exact HTML.
 * Distinct from wave50 strong-tag / active-class soft checks. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 59 calla — score seat icons exact', () => {
  it('renders Blue/Red score rows with seat icons', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el, 'human-vs-human');
    expect(el.querySelector('.calla-score-p1')?.innerHTML).toBe(
      '🔵 Blue: <strong>0</strong>'
    );
    expect(el.querySelector('.calla-score-p2')?.innerHTML).toBe(
      '🔴 Red: <strong>0</strong>'
    );
  });
});
