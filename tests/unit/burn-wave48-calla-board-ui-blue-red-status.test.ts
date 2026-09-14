/**
 * Wave 48 — Calla board-ui HvH Blue/Red status chrome leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 48 calla — board-ui Blue/Red status', () => {
  it('HvH status labels Blue and Red scores', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el, 'human-vs-human');
    expect(el.textContent).toMatch(/Blue/);
    expect(el.textContent).toMatch(/Red/);
    expect(el.querySelector('.calla-status')).toBeTruthy();
  });
});
