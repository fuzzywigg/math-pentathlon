/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — fab × fiar inject chrome handshake.
 * Distinct from wave58 panel-shadow/chip-height; deepen header type + status color. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';
import { newGameVsHuman as fabHuman } from '../../src/games/fab-a-diffy/game-controller';
import { initGame as initFiar } from '../../src/games/fiar/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 59 handshake — fab × fiar inject chrome', () => {
  it('section-header type + status color vars mount with shells', () => {
    injectFabStyles();
    injectFiarStyles();
    const fabCss = document.getElementById('fab-styles')!.textContent || '';
    const fiarCss = document.getElementById('fiar-styles')!.textContent || '';
    expect(fabCss).toContain('font-size: 1.1rem');
    expect(fabCss).toContain('.fab-bar-used');
    expect(fiarCss).toContain('color: var(--color-player1, #2196f3)');
    expect(fiarCss).toContain('.fiar-board-container svg');

    const fabBox = document.createElement('div');
    document.body.appendChild(fabBox);
    fabHuman(fabBox);
    expect(fabBox.querySelector('.fab-section-header')).toBeTruthy();
    expect(fabBox.querySelector('.fab-bar-pool')).toBeTruthy();
    expect(fabBox.querySelector('.fab-answer-board')).toBeTruthy();

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initFiar(board, status);
    expect(status.querySelector('.fiar-status')).toBeTruthy();
    expect(board.querySelector('svg.fiar-board, svg')).toBeTruthy();
  });
});
