/**
 * Wave 55 leftover after #250 — Handshake demos × juggle/ramrod board-ui mounts.
 * Avoids calla pit/arrow and contig cell slices from open #251/#243. Tests-only.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import {
  injectJuggleStyles,
  renderBoard as renderJuggle,
  renderDice,
} from '../../src/games/juggle/board-ui';
import {
  injectRamrodStyles,
  renderBoard as renderRamrod,
  renderRodLegend,
} from '../../src/games/ramrod/board-ui';

describe('Wave 55 handshake — demos/juggle/ramrod', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    document.getElementById('ramrod-styles')?.remove();
  });

  it('mounts demo + juggle + ramrod leftover chrome together', () => {
    injectJuggleStyles();
    injectRamrodStyles();
    expect(document.getElementById('juggle-styles')?.textContent).toMatch(/700px/);
    expect(document.getElementById('ramrod-styles')?.textContent).toMatch(/768px/);

    const demos = document.createElement('div');
    document.body.appendChild(demos);
    renderDiceDemo(demos);
    expect(demos.querySelector('#selector-poly')).toBeTruthy();
    renderGraphDemo(demos);
    expect(demos.querySelector('.template-btn[data-template="hex"]')).toBeTruthy();

    const j = juggleInit();
    expect(
      renderJuggle(
        j.boards.player2,
        'player2',
        true,
        j,
        () => undefined,
        () => undefined,
        () => undefined
      ).querySelector('.fill-percent')?.textContent
    ).toBe('0%');
    expect(
      renderDice([6, 6], () => undefined, () => undefined, false, 'placing').textContent
    ).toMatch(/⚅/);

    const r = ramrodInit();
    expect(renderRamrod(r, () => undefined).querySelectorAll('.ramrod-slot').length).toBe(24);
    expect(renderRodLegend().textContent).toMatch(/1cm/);
  });
});
