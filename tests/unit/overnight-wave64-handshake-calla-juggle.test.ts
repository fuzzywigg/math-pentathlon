/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Handshake calla×juggle residual.
 * Distinct from wave62/63 handshakes; no ramrod, no e2e. Tests-only.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';
import { renderBoard as renderCalla } from '../../src/games/calla/board-ui';
import { getAIMove } from '../../src/games/calla/ai';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { injectJuggleStyles, renderBoard as renderJuggle } from '../../src/games/juggle/board-ui';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

afterEach(() => vi.restoreAllMocks());

describe('Wave 64 handshake — calla × juggle leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts residual calla aria/capture with juggle inject/tutorial leftovers', () => {
    const callaEl = document.createElement('div');
    renderCalla(callaInit(), callaEl);
    expect(
      callaEl
        .querySelector('.calla-pit[data-side="player1"][data-pit-index="0"]')
        ?.getAttribute('aria-label')
    ).toBe('Blue pit 1, Blue, 3 cubes, valid move');
    expect(
      callaEl
        .querySelector('.calla-store-p2 .calla-store-rect')
        ?.getAttribute('x')
    ).toBe('10');
    expect(
      getLastMoveInfo(
        makeMove(
          {
            ...callaInit(),
            player1Pits: [1, 0, 0, 0, 0],
            player2Pits: [0, 0, 0, 4, 0],
          },
          0
        )
      )
    ).toBe('Blue distributed 1 cube, captured 5!');
    expect(
      callaTutorial.steps.find((s) => s.id === 'board-intro')?.message
    ).toContain("Red's pits");

    let n = 0;
    const seq = [0.05, 0, 0.2, 0.7];
    vi.spyOn(Math, 'random').mockImplementation(() => seq[n++ % seq.length]!);
    expect(
      getAIMove(
        {
          ...callaInit(),
          player1Pits: [2, 0, 0, 4, 0],
          player2Pits: [1, 0, 0, 0, 1],
        },
        'player1',
        'easy'
      )?.hint
    ).toBe("Look carefully! There's a chance to capture 5 cubes.");
    vi.restoreAllMocks();

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toMatch(
      /\.juggle-control-btn\s*\{[^}]*border-radius:\s*6px/
    );
    expect(jCss).toMatch(
      /\.juggle-roll-btn:disabled\s*\{[^}]*cursor:\s*not-allowed/
    );
    expect(jCss).toMatch(/\.juggle-grid\s*\{[^}]*border-radius:\s*4px/);

    const js = juggleInit();
    const board = renderJuggle(
      js.boards.player1,
      'player1',
      true,
      { ...js, phase: 'placing' },
      () => undefined,
      () => undefined,
      () => undefined
    );
    expect(
      board
        .querySelector('.juggle-cell[data-row="0"][data-col="0"]')
        ?.getAttribute('aria-label')
    ).toBe('A1, empty');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'dice-values')?.message
    ).toContain('2</strong> = Domino (2 cells)');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'turn-sequence')?.message
    ).toContain('Place:</strong>');
  });
});
