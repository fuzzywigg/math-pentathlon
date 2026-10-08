/**
 * Wave 62 leftover after #293 — Handshake calla×juggle residual (unit-only).
 * Distinct from wave60 CJR three-engine handshake; no ramrod, no e2e. Tests-only.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { renderBoard as renderCalla, renderStatus } from '../../src/games/calla/board-ui';
import { getPhaseMessage } from '../../src/games/calla/rules';
import { analyzeMoves } from '../../src/games/calla/ai';
import { callaTutorial } from '../../src/games/calla/tutorial';
import {
  injectJuggleStyles,
} from '../../src/games/juggle/board-ui';
import { initGame } from '../../src/games/juggle/game-controller';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

afterEach(() => vi.restoreAllMocks());

describe('Wave 62 handshake — calla × juggle leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts residual calla geometry/copy with juggle inject/status leftovers', () => {
    const callaEl = document.createElement('div');
    renderCalla(callaInit(), callaEl);
    expect(
      callaEl.querySelector('.calla-board-bg')?.getAttribute('width')
    ).toBe('500');
    expect(
      callaEl.querySelector('#arrowhead-p2')?.getAttribute('markerHeight')
    ).toBe('7');
    expect(
      getPhaseMessage({
        ...callaInit(),
        phase: 'gameOver',
        winner: 'tie',
      })
    ).toBe("It's a tie!");

    const status = document.createElement('div');
    renderStatus(
      {
        ...callaInit(),
        phase: 'gameOver',
        winner: 'player1',
      },
      status,
      'human-vs-ai'
    );
    expect(status.querySelector('.status-winner')?.textContent).toBe(
      '🎉 🔵 You Wins! 🎉'
    );
    expect(
      analyzeMoves(
        {
          ...callaInit(),
          player1Pits: [2, 0, 0, 4, 0],
          player2Pits: [1, 0, 0, 0, 1],
        },
        'player1'
      ).find((a) => a.pit === 0)?.reasoning
    ).toContain('Warning: Sets up opponent to capture 5 cubes!');
    expect(
      callaTutorial.steps.find((s) => s.id === 'capture')?.message
    ).toContain('Another special rule');

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toMatch(/\.juggle-boards\s*\{[^}]*gap:\s*2rem/);
    expect(jCss).toContain('0 0 10px rgba(255,215,0,0.5)');
    expect(jCss).toMatch(/\.juggle-cell\s*\{[^}]*height:\s*28px/);

    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const seq = [2 / 6, 3 / 6];
      return seq[n++ % 2]!;
    });
    const board = document.createElement('div');
    const jStatus = document.createElement('div');
    document.body.append(board, jStatus);
    initGame(board, jStatus);
    (board.querySelector('.juggle-roll-btn') as HTMLButtonElement).click();
    expect(jStatus.querySelector('.juggle-status')?.textContent?.trim()).toBe(
      "🔵 Blue's turn - Click a die to choose shape category"
    );
    expect(
      juggleTutorial.steps.find((s) => s.id === 'placement-rules')?.message
    ).toContain('fit entirely within your 9x9 grid');
  });
});
