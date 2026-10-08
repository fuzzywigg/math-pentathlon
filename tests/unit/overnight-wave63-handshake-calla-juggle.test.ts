/**
 * Wave 63 leftover after tip/#301 — Handshake calla×juggle residual (unit-only).
 * Distinct from wave62 handshake; no ramrod, no e2e. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 63 handshake — calla × juggle leftovers', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts residual calla last-move/tutorial with juggle inject/tutorial leftovers', () => {
    expect(getLastMoveInfo(makeMove(callaInit(), 2))).toBe(
      'Blue distributed 3 cubes Free turn!'
    );
    expect(
      callaTutorial.steps.find((s) => s.id === 'strategy-tip')?.message
    ).toContain('Tips for winning:');
    expect(
      callaTutorial.steps.find((s) => s.id === 'pits-explained')?.message
    ).toContain('Each pit starts with <strong>3 cubes</strong>');
    expect(
      callaTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('start collecting cubes!');

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toContain('linear-gradient(135deg, #ff9800, #f57c00)');
    expect(jCss).toMatch(/\.juggle-cell\s*\{[^}]*height:\s*24px/);
    expect(jCss).toMatch(/\.fill-percent\s*\{[^}]*opacity:\s*0\.8/);
    expect(jCss).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*padding:\s*1\.5rem/
    );

    expect(
      juggleTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('Now you know how to play Juggle!');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('Larger shapes fill the board faster');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain(
      'Be the first player to completely fill your 9x9 grid with polyomino shapes!'
    );
  });
});
