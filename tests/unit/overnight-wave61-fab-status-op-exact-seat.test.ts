/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab op status exact seat.
 * Wave55 uses toMatch; deepen exact Choose operation leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — status op exact seat', () => {
  it('operation phase status is exact with seat icon', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    ctrl.state = {
      ...ctrl.state,
      phase: 'selectingOperation',
      selectedBar1: 'x',
      selectedBar2: 'y',
    };
    ctrl.update();
    expect(container.querySelector('.fab-status')?.textContent).toBe(
      "🔵 Blue's turn - Choose an operation"
    );
  });
});
