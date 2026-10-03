/**
 * Wave 55 leftover after #249/#250 — fab × fiar controller/tutorial handshake. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';
import { newGameVsHuman as fabHuman } from '../../src/games/fab-a-diffy/game-controller';
import { initGame as initFiar } from '../../src/games/fiar/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 55 handshake — fab × fiar leftovers', () => {
  it('tutorial ids unique; controllers mount residual status chrome', () => {
    expect(fabADiffyTutorial.id).not.toBe(fiarTutorial.id);
    expect(fabADiffyTutorial.steps.some((s) => s.id === 'rules')).toBe(true);
    expect(fiarTutorial.steps.some((s) => s.id === 'game-phases')).toBe(true);

    const fabBox = document.createElement('div');
    document.body.appendChild(fabBox);
    fabHuman(fabBox);
    expect(fabBox.querySelector('.fab-status')?.textContent).toMatch(
      /Select first fraction bar/
    );
    expect(fabBox.querySelector('.fab-main-layout')).toBeTruthy();

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initFiar(board, status);
    expect(status.querySelector('.fiar-status')?.textContent).toMatch(
      /Place a chip/
    );
    expect(status.querySelector('.fiar-chips-info')).toBeTruthy();
  });
});
