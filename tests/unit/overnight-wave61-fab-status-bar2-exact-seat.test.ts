/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab bar2 status exact seat.
 * Wave55 uses toMatch; deepen exact Blue bar2 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — status bar2 exact seat', () => {
  it('bar2 phase status is exact with seat icon', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    ctrl.state = { ...ctrl.state, phase: 'selectingBar2', selectedBar1: 'x' };
    ctrl.update();
    expect(container.querySelector('.fab-status')?.textContent).toBe(
      "🔵 Blue's turn - Select second fraction bar"
    );
  });
});
