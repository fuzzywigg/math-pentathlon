/**
 * Wave 64 leftover after tip/#303 — Handshake calla×juggle residual (unit-only).
 * Distinct from wave63 handshake; no ramrod, no e2e. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 64 handshake — calla × juggle leftovers', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts residual calla capture/tutorial with juggle inject/tutorial leftovers', () => {
    const captureState = {
      ...callaInit(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 4, 0],
      player1Calla: 10,
      player2Calla: 15,
    };
    expect(getLastMoveInfo(makeMove(captureState, 0))).toBe(
      'Blue distributed 1 cube, captured 5!'
    );
    expect(
      callaTutorial.steps.find((s) => s.id === 'board-intro')?.message
    ).toContain("Red's pits");
    expect(
      callaTutorial.steps.find((s) => s.id === 'capture')?.message
    ).toContain('You capture ALL those cubes into your Calla');
    expect(
      callaTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('Now you know how to play Calla!');

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toContain('var(--color-player1, #2196f3)');
    expect(jCss).toMatch(
      /\.juggle-roll-btn:disabled\s*\{[^}]*cursor:\s*not-allowed/
    );
    expect(jCss).toMatch(/\.juggle-shape-list\s*\{[^}]*flex-wrap:\s*wrap/);
    expect(jCss).toMatch(
      /\.juggle-control-btn\s*\{[^}]*border-radius:\s*6px/
    );

    expect(
      juggleTutorial.steps.find((s) => s.id === 'turn-sequence')?.message
    ).toContain('Roll two dice');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'dice-values')?.message
    ).toContain('Monomino (1 cell)');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'placement-rules')?.message
    ).toContain('Shapes must fit entirely within your 9x9 grid');
  });
});
