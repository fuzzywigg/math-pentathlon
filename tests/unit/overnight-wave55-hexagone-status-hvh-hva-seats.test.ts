/**
 * Wave 55 leftover after #250 — Hex-a-Gone HvH vs HvA player seat labels. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hexagone — status seats', () => {
  it('Blue Player / Red Player vs You / AI', () => {
    const s = createInitialState();
    const hvh = document.createElement('div');
    renderStatus(s, hvh);
    expect(hvh.textContent).toMatch(/Blue Player/);
    expect(hvh.textContent).toMatch(/Red Player/);
    expect(hvh.querySelector('.player-indicator.active')).toBeTruthy();
    const hva = document.createElement('div');
    renderStatus(s, hva, 'human-vs-ai', false);
    expect(hva.textContent).toMatch(/You/);
    expect(hva.textContent).toMatch(/AI/);
    expect(hva.textContent).not.toMatch(/Blue Player/);
  });
});
