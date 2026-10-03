/**
 * Wave 57 leftover after #257 — fab × fiar seat/op/inject handshake. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';
import { newGameVsHuman as fabHuman } from '../../src/games/fab-a-diffy/game-controller';
import { initGame as initFiar } from '../../src/games/fiar/game-controller';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 57 handshake — fab × fiar leftovers', () => {
  it('ops verbs + status seats + inject tokens mount together', () => {
    const ops = fabADiffyTutorial.steps.find((s) => s.id === 'operations');
    expect(ops?.message).toMatch(/Add fractions/);
    expect(fiarTutorial.steps.some((s) => s.id === 'objective')).toBe(true);

    injectFabStyles();
    injectFiarStyles();
    const fabCss = document.getElementById('fab-styles')!.textContent || '';
    const fiarCss = document.getElementById('fiar-styles')!.textContent || '';
    expect(fabCss).toContain('animation: fab-glow');
    expect(fiarCss).toContain('width: 16px');

    const fabBox = document.createElement('div');
    document.body.appendChild(fabBox);
    fabHuman(fabBox);
    expect(fabBox.querySelector('.fab-status.player1')).toBeTruthy();

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initFiar(board, status);
    expect(status.querySelector('.fiar-status.player1')).toBeTruthy();
    expect(status.querySelector('.fiar-chip-icon')).toBeTruthy();
  });
});
