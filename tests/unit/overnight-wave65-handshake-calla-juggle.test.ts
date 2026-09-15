/**
 * Wave 65 leftover after tip/#315 — Handshake calla×juggle residual (unit-only).
 * Distinct from wave64 handshake; no ramrod, no e2e. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 handshake — calla × juggle leftovers', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts residual calla free-turn/tutorial with juggle inject/tutorial leftovers', () => {
    const redFree = makeMove(
      { ...callaInit(), currentPlayer: 'player2' },
      2
    );
    expect(getLastMoveInfo(redFree)).toBe(
      'Red distributed 3 cubes Free turn!'
    );
    expect(
      callaTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain("Let's learn how to play <strong>Calla</strong>!");
    expect(
      callaTutorial.steps.find((s) => s.id === 'strategy-tip')?.message
    ).toContain('Count ahead to land in your Calla!');
    expect(
      callaTutorial.steps.find((s) => s.id === 'free-turn')?.message
    ).toContain('<strong>Special rule:</strong>');

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toMatch(
      /\.juggle-dice-area\s*\{[^}]*flex-direction:\s*column/
    );
    expect(jCss).toMatch(/\.juggle-die\s*\{[^}]*border-radius:\s*12px/);
    expect(jCss).toMatch(/\.juggle-status\s*\{[^}]*text-align:\s*center/);
    expect(jCss).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*font-size:\s*1\.5rem/
    );

    expect(
      juggleTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain("Let's learn how to play <strong>Juggle</strong>!");
    expect(
      juggleTutorial.steps.find((s) => s.id === 'turn-sequence')?.message
    ).toContain('<strong>Select:</strong>');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('Save small shapes for filling gaps');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'dice-values')?.message
    ).toContain('<strong>5-6</strong> = Pentomino (5 cells)');
  });
});
