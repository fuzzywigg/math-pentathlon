/**
 * Wave 48 — Calla board-ui human-vs-ai You/AI labels leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 48 calla — board-ui You/AI labels', () => {
  it('HvA mode uses You and AI score labels', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el, 'human-vs-ai');
    expect(el.textContent).toMatch(/You/);
    expect(el.textContent).toMatch(/AI/);
  });
});
