/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — fab × fiar inject chrome handshake.
 * Distinct from wave57 seat/op handshake; deepen panel shadow + chip height. Tests-only.
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

describe('Wave 58 handshake — fab × fiar inject chrome', () => {
  it('panel shadow + chip height mount with bar-pool and chip-icon', () => {
    injectFabStyles();
    injectFiarStyles();
    const fabCss = document.getElementById('fab-styles')!.textContent || '';
    const fiarCss = document.getElementById('fiar-styles')!.textContent || '';
    expect(fabCss).toContain('box-shadow: 0 2px 8px rgba(0,0,0,0.1)');
    expect(fabCss).toContain('0 0 0 0 rgba(76, 175, 80, 0.4)');
    expect(fiarCss).toContain('height: 16px');
    expect(fiarCss).toContain('opacity: 0.5');

    const fabBox = document.createElement('div');
    document.body.appendChild(fabBox);
    fabHuman(fabBox);
    expect(fabBox.querySelector('.fab-bar-pool')).toBeTruthy();

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initFiar(board, status);
    expect(status.querySelector('.fiar-chip-icon')).toBeTruthy();
    expect(status.querySelector('.fiar-chips-info')).toBeTruthy();
  });
});
