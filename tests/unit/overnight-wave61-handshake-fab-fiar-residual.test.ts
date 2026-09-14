/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — fab × fiar residual handshake.
 * Distinct from wave59 header/status handshake; deepen gap + board pad. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';
import { newGameVsHuman as fabHuman } from '../../src/games/fab-a-diffy/game-controller';
import { initGame as initFiar } from '../../src/games/fiar/game-controller';
import { CONFIG } from '../../src/games/fiar/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 61 handshake — fab × fiar residual', () => {
  it('game-area gap + board pad mount with exact opening chrome', () => {
    injectFabStyles();
    injectFiarStyles();
    const fabCss = document.getElementById('fab-styles')!.textContent || '';
    const fiarCss = document.getElementById('fiar-styles')!.textContent || '';
    expect(fabCss).toContain('gap: 1rem');
    expect(fabCss).toContain('.fab-history-move');
    expect(fiarCss).toContain('justify-content: center');
    expect(fiarCss).toContain('font-size: 1.5rem');

    const fabBox = document.createElement('div');
    document.body.appendChild(fabBox);
    fabHuman(fabBox);
    expect(fabBox.querySelector('.fab-status')?.textContent).toBe(
      "🔵 Blue's turn - Select first fraction bar"
    );
    expect(fabBox.querySelector('.fab-score-p1 .fab-score-label')?.textContent).toBe(
      '🔵 Blue'
    );

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initFiar(board, status);
    expect(status.querySelector('.fiar-status')?.textContent?.trim()).toBe(
      `Blue's turn: Place a chip (${CONFIG.CHIPS_PER_PLAYER} left)`
    );
  });
});
