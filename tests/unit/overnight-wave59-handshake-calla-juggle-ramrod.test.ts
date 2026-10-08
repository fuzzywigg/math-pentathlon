/**
 * Wave 59 leftover after #279 — Handshake calla/juggle/ramrod seat/inject leftovers.
 * Distinct from wave58 registry/banner/header mounts. Tests-only.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';
import { analyzeMoves } from '../../src/games/calla/ai';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import {
  injectJuggleStyles,
  renderShapeSelector,
} from '../../src/games/juggle/board-ui';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import {
  injectRamrodStyles,
  renderScores,
} from '../../src/games/ramrod/board-ui';
import { newGameVsHuman } from '../../src/games/ramrod/game-controller';
import { juggleTutorial } from '../../src/games/juggle/tutorial';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';
import { callaTutorial } from '../../src/games/calla/tutorial';

afterEach(() => vi.restoreAllMocks());

describe('Wave 59 handshake — calla/juggle/ramrod leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    document.getElementById('ramrod-styles')?.remove();
  });

  it('mounts seat-score / inject / tutorial leftovers across three engines', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const callaStatus = document.createElement('div');
    renderStatus(callaInit(), callaStatus, 'human-vs-human');
    expect(callaStatus.querySelector('.calla-score-p1')?.innerHTML).toBe(
      '🔵 Blue: <strong>0</strong>'
    );
    expect(
      analyzeMoves(callaInit(), 'player1').find((a) => a.pit === 2)?.reasoning
    ).toBe('Lands in your Calla for a free turn!');
    expect(
      callaTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('🧊');

    injectJuggleStyles();
    expect(document.getElementById('juggle-styles')?.textContent).toContain(
      '#fff8e1'
    );
    expect(document.getElementById('juggle-styles')?.textContent).toContain(
      'linear-gradient(135deg, #ffd700, #ffec8b)'
    );
    const shapes = renderShapeSelector(
      {
        ...juggleInit(),
        phase: 'selectingShape',
        currentDice: [3, 1],
        selectedCategory: 'tromino',
      },
      () => undefined
    );
    expect(
      [...shapes.querySelectorAll('.shape-name')].map((n) => n.textContent)
    ).toEqual(expect.arrayContaining(['I-tromino', 'L-tromino']));
    expect(
      juggleTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('Save small shapes');

    injectRamrodStyles();
    expect(document.getElementById('ramrod-styles')?.textContent).toContain(
      'linear-gradient(135deg, #2196f3, #1976d2)'
    );
    expect(
      [...renderScores(ramrodInit()).querySelectorAll('.label')].map(
        (n) => n.textContent
      )
    ).toEqual(['🔵 Blue:', '🔴 Red:']);
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.ramrod-status')?.textContent).toBe(
      "🔵 Blue's turn - Select a rod"
    );
    expect(
      ramrodTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('Higher value boxes');
  });
});
