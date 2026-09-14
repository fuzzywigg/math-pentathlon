/**
 * Wave 56 leftover after #256 — Handshake calla/juggle/ramrod leftover chrome.
 * Distinct from wave52 mounts and wave55 demos handshake. Tests-only.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { renderBoard as renderCalla } from '../../src/games/calla/board-ui';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import {
  injectJuggleStyles,
  renderBoard as renderJuggle,
  renderShapeControls,
} from '../../src/games/juggle/board-ui';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import {
  injectRamrodStyles,
  renderBoard as renderRamrod,
} from '../../src/games/ramrod/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';
import { getCategoryName } from '../../src/games/juggle/types';
import { ROD_NAMES as RAMROD_NAMES } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 56 handshake — calla/juggle/ramrod leftovers', () => {
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
    expect(document.getElementById('juggle-styles')?.textContent).toMatch(
      /#ffc107/
    );

    const callaEl = document.createElement('div');
    renderCalla(callaInit(), callaEl);
    expect(callaEl.querySelector('.calla-wrapper')).toBeTruthy();
    expect(
      callaEl.querySelector('#arrowhead-p1 polygon')?.getAttribute('fill')
    ).toBe('#1976d2');

    const j = juggleInit();
    const shape = SHAPE_POOLS.tromino.find((s) => s.canRotate && s.canFlip)!;
    const controls = renderShapeControls(
      { ...j, phase: 'placing', selectedShape: shape },
      () => undefined,
      () => undefined
    );
    expect(controls.textContent).toMatch(/↻ Rotate/);
    expect(
      renderJuggle(
        j.boards.player1,
        'player1',
        true,
        { ...j, phase: 'placing' },
        () => undefined,
        () => undefined,
        () => undefined
      )
        .querySelector('[data-row="0"][data-col="0"]')
        ?.getAttribute('aria-label')
    ).toMatch(/A1/);
    expect(getCategoryName('tromino')).toBe('Tromino (3 cells)');
    expect(juggleTutorial.id).toBe('juggle-basics');

    const r = ramrodInit();
    const board = renderRamrod(r, () => undefined);
    const box = board.querySelectorAll('.ramrod-box')[6];
    expect(box.querySelectorAll('.ramrod-slot')[0].getAttribute('data-col')).toBe(
      '4'
    );
    expect(RAMROD_NAMES[1]).toBe('White');
    expect(ramrodTutorial.steps.map((s) => s.id)).toContain('cuisenaire-rods');
  });
});
