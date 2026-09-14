/**
 * Wave 55 leftover after #249/#250 — Fab controller status phase copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 55 fab — controller status phase copy', () => {
  it('paints exact phase prompts for bar1/bar2/op/confirm', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);

    expect(container.querySelector('.fab-status.player1')?.textContent).toMatch(
      /Blue's turn - Select first fraction bar/
    );

    ctrl.state = { ...ctrl.state, phase: 'selectingBar2', selectedBar1: 'x' };
    ctrl.update();
    expect(container.querySelector('.fab-status')?.textContent).toMatch(
      /Select second fraction bar/
    );

    ctrl.state = {
      ...ctrl.state,
      phase: 'selectingOperation',
      selectedBar1: 'x',
      selectedBar2: 'y',
    };
    ctrl.update();
    expect(container.querySelector('.fab-status')?.textContent).toMatch(
      /Choose an operation/
    );

    ctrl.state = {
      ...ctrl.state,
      phase: 'confirmingMove',
      selectedBar1: 'x',
      selectedBar2: 'y',
      selectedOperation: 'add',
    };
    ctrl.update();
    expect(container.querySelector('.fab-status')?.textContent).toMatch(
      /Select matching answer/
    );
  });
});
