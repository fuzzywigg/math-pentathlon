/**
 * Wave 65 leftover after tip/#315 — Handshake calla×juggle residual (unit-only).
 * Distinct from wave64 handshake; no ramrod, no e2e. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState as callaInit, type CallaGameState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 handshake — calla × juggle leftovers', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts residual calla last-move/tutorial with juggle inject/tutorial leftovers', () => {
    const redFree: CallaGameState = {
      ...callaInit(),
      currentPlayer: 'player2',
      player2Pits: [0, 0, 3, 0, 0],
      player1Pits: [1, 1, 1, 1, 1],
    };
    expect(getLastMoveInfo(makeMove(redFree, 2))).toBe(
      'Red distributed 3 cubes Free turn!'
    );
    expect(
      callaTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain("Let's learn how to play <strong>Calla</strong>!");
    expect(
      callaTutorial.steps.find((s) => s.id === 'strategy-tip')?.message
    ).toContain('Count ahead to land in your Calla!');
    expect(
      callaTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('<p>Good luck! 🧊</p>');

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toMatch(/\.juggle-status\s*\{[^}]*text-align:\s*center/);
    expect(jCss).toMatch(
      /\.juggle-dice-area\s*\{[^}]*flex-direction:\s*column/
    );
    expect(jCss).toMatch(/\.shape-name\s*\{[^}]*font-size:\s*0\.75rem/);
    expect(jCss).toMatch(
      /\.juggle-die\.selectable\s*\{[^}]*cursor:\s*pointer/
    );

    expect(
      juggleTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('Save small shapes for filling gaps');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'turn-sequence')?.message
    ).toContain('<strong>Roll:</strong>');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain("Let's learn how to play <strong>Juggle</strong>!");
  });
});
