/**
 * Overnight HEAVY leftover after #234 — Handshake opening mounts calla/juggle/ramrod. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { renderBoard as renderCalla, renderStatus } from '../../src/games/calla/board-ui';
import { renderBoard as renderJuggle, renderDice } from '../../src/games/juggle/board-ui';
import {
  renderBoard as renderRamrod,
  renderScores,
  renderRodLegend,
} from '../../src/games/ramrod/board-ui';

describe('Wave 52 handshake — opening mounts', () => {
  it('mounts core chrome for calla, juggle, and ramrod openings', () => {
    const callaEl = document.createElement('div');
    renderCalla(callaInit(), callaEl);
    expect(callaEl.querySelectorAll('.calla-pit').length).toBe(10);
    const statusEl = document.createElement('div');
    renderStatus(callaInit(), statusEl);
    expect(statusEl.querySelector('.calla-scores')).toBeTruthy();

    const j = juggleInit();
    expect(
      renderJuggle(
        j.boards.player1,
        'player1',
        true,
        j,
        () => undefined,
        () => undefined,
        () => undefined
      ).querySelectorAll('.juggle-cell').length
    ).toBeGreaterThan(0);
    expect(renderDice(null, () => undefined, () => undefined, true, 'rolling').querySelector('.juggle-roll-btn')).toBeTruthy();

    const r = ramrodInit();
    expect(renderRamrod(r, () => undefined).querySelectorAll('.ramrod-box').length).toBe(12);
    expect(renderScores(r).querySelector('.ramrod-target')).toBeTruthy();
    expect(renderRodLegend().querySelectorAll('.ramrod-legend-item').length).toBe(10);
  });
});
