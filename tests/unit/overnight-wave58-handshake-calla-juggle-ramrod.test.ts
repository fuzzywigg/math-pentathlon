/**
 * Wave 58 leftover after #262 (retry #273 RED) — Handshake calla/juggle/ramrod leftovers.
 * Distinct from wave56 wrapper/rotate/slot mounts. Tests-only.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { renderBoard as renderCalla, renderStatus } from '../../src/games/calla/board-ui';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import {
  injectJuggleStyles,
  renderBoard as renderJuggle,
  renderDice,
  renderShapeSelector,
} from '../../src/games/juggle/board-ui';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import {
  injectRamrodStyles,
  renderScores,
  renderBoard as renderRamrod,
} from '../../src/games/ramrod/board-ui';
import { ROD_COLORS } from '../../src/games/ramrod/types';
import { getGameById } from '../../src/core/game-registry';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { juggleTutorial } from '../../src/games/juggle/tutorial';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';

afterEach(() => vi.restoreAllMocks());

describe('Wave 58 handshake — calla/juggle/ramrod leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    document.getElementById('ramrod-styles')?.remove();
  });

  it('mounts distinct leftover chrome across the three engines', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    injectJuggleStyles();
    injectRamrodStyles();
    expect(document.getElementById('juggle-styles')?.textContent).toContain(
      '#ff9800'
    );
    expect(document.getElementById('ramrod-styles')?.textContent).toContain(
      '#e8d4b8'
    );

    const callaEl = document.createElement('div');
    renderCalla(callaInit(), callaEl);
    expect(
      [...callaEl.querySelectorAll('.calla-store-label')].map((n) => n.textContent)
    ).toEqual(expect.arrayContaining(['🔵', '🔴']));
    expect(
      callaEl.querySelector('#arrowhead-p1')?.getAttribute('refX')
    ).toBe('9');
    const status = document.createElement('div');
    renderStatus(
      { ...callaInit(), phase: 'animating', currentPlayer: 'player1' },
      status
    );
    expect(status.textContent).toContain('Blue is distributing cubes...');

    const j = juggleInit();
    expect(
      renderDice(null, () => undefined, () => undefined, true, 'rolling')
        .querySelector('.juggle-roll-btn')?.textContent
    ).toBe('Roll Dice');
    expect(
      renderShapeSelector(
        {
          ...j,
          phase: 'selectingShape',
          currentDice: [1, 2],
          selectedCategory: 'monomino',
        },
        () => undefined
      ).querySelector('.juggle-shape-header')?.textContent
    ).toBe('Choose a monomino:');
    expect(
      renderJuggle(
        j.boards.player1,
        'player1',
        true,
        j,
        () => undefined,
        () => undefined,
        () => undefined
      )
        .querySelector('[data-row="8"][data-col="8"]')
        ?.getAttribute('aria-label')
    ).toMatch(/I9/);

    expect(renderScores(ramrodInit()).querySelector('.ramrod-target')?.textContent).toBe(
      'Goal: 24cm'
    );
    expect(ROD_COLORS[1]).toBe('#ffffff');
    const rBoard = renderRamrod(ramrodInit(), () => undefined);
    expect(rBoard.querySelector('.ramrod-slot')?.getAttribute('aria-label')).toMatch(
      /Sum \d+ slot 1/
    );

    expect(getGameById('calla')?.icon).toBe('🎯');
    expect(getGameById('juggle')?.icon).toBe('⊞');
    expect(getGameById('ramrod')?.icon).toBe('▭');
    expect(callaTutorial.steps[0]?.title).toBe('Welcome to Calla!');
    expect(juggleTutorial.steps.map((s) => s.title)).toContain('Dice Values');
    expect(ramrodTutorial.steps.map((s) => s.title)).toContain('Cuisenaire Rods');
  });
});
