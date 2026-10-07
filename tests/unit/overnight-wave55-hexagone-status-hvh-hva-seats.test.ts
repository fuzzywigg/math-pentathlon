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
  it('Blue / Red vs You / Computer', () => {
    const s = createInitialState();
    const hvh = document.createElement('div');
    renderStatus(s, hvh);
    const hvhSeats = [...hvh.querySelectorAll('.player-indicator')].map(
      (el) => el.textContent ?? ''
    );
    expect(hvhSeats.join(' ')).toMatch(/Blue/);
    expect(hvhSeats.join(' ')).toMatch(/Red/);
    expect(hvh.querySelector('.player-indicator.active')).toBeTruthy();
    const hva = document.createElement('div');
    renderStatus(s, hva, 'human-vs-ai', false);
    const seatLabels = [...hva.querySelectorAll('.player-indicator')].map(
      (el) => el.textContent ?? ''
    );
    expect(seatLabels.join(' ')).toMatch(/You/);
    expect(seatLabels.join(' ')).toMatch(/Computer/);
    expect(seatLabels.join(' ')).not.toMatch(/Blue/);
  });
});
