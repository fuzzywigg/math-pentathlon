/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab confirm status exact seat.
 * Wave55 uses toMatch; deepen exact matching answer leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — status confirm exact seat', () => {
  it('confirm phase status is exact with seat icon', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    ctrl.state = {
      ...ctrl.state,
      phase: 'confirmingMove',
      selectedBar1: 'x',
      selectedBar2: 'y',
      selectedOperation: 'add',
    };
    ctrl.update();
    expect(container.querySelector('.fab-status')?.textContent).toBe(
      "🔵 Blue's turn - Select matching answer"
    );
  });
});
