/**
 * Wave 60 leftover after tip/#279 (post-#289 residual) — Handshake CJR chrome.
 * Mounts SVG geometry + inject RGBA + registry secondary across three engines.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { renderBoard as renderCalla } from '../../src/games/calla/board-ui';
import { getPhaseMessage } from '../../src/games/calla/rules';
import { analyzeMoves } from '../../src/games/calla/ai';
import { callaTutorial } from '../../src/games/calla/tutorial';
import {
  injectJuggleStyles,
  getPlayerName as juggleName,
} from '../../src/games/juggle/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';
import {
  injectRamrodStyles,
  renderRodLegend,
} from '../../src/games/ramrod/board-ui';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';
import { getGameById } from '../../src/core/game-registry';
import { seatIcon } from '../../src/ui/player-colors';

afterEach(() => vi.restoreAllMocks());

describe('Wave 60 handshake — calla/juggle/ramrod leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    document.getElementById('ramrod-styles')?.remove();
  });

  it('mounts residual geometry, inject tokens, and secondary registry', () => {
    const callaEl = document.createElement('div');
    renderCalla(callaInit(), callaEl);
    expect(callaEl.querySelector('.calla-pit-circle')?.getAttribute('r')).toBe(
      '32'
    );
    expect(
      callaEl.querySelector('.calla-store-rect')?.getAttribute('width')
    ).toBe('50');
    expect(callaEl.querySelector('.calla-cube')?.getAttribute('r')).toBe('4');
    expect(getPhaseMessage(callaInit())).toBe(
      "Blue's turn - Select a shield to distribute"
    );
    expect(
      analyzeMoves(callaInit(), 'player1').find((a) => a.pit === 0)?.reasoning
    ).toBe('A safe, neutral move.');
    expect(
      callaTutorial.steps.find((s) => s.id === 'your-calla')?.message
    ).toContain("skip over your opponent's Calla");

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toContain('rgba(76, 175, 80, 0.5)');
    expect(jCss).toMatch(/\.juggle-board\s*\{[^}]*background:\s*#f5f5f5/);
    expect(jCss).toMatch(/animation:\s*juggle-glow/);
    expect(
      `${seatIcon('player1')} ${juggleName('player1')}'s turn - Roll the dice`
    ).toBe("🔵 Blue's turn - Roll the dice");
    expect(
      juggleTutorial.steps.find((s) => s.id === 'dice-values')?.message
    ).toContain('1</strong> = Monomino');

    injectRamrodStyles();
    const rCss = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(rCss).toMatch(/\.ramrod-box\s*\{[^}]*background:\s*#f5f0e8/);
    expect(rCss).toMatch(
      /\.ramrod-slot\.valid\s*\{[^}]*background:\s*rgba\(76, 175, 80, 0\.2\)/
    );
    expect(rCss).toMatch(
      /\.ramrod-winner-banner\s*\{[^}]*animation:\s*ramrod-glow/
    );
    expect(renderRodLegend().querySelector('h4')?.textContent).toBe(
      'Cuisenaire Rods'
    );
    expect(
      ramrodTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('Set up captures for yourself');

    for (const id of ['calla', 'juggle', 'ramrod'] as const) {
      const g = getGameById(id);
      expect(g?.playerCount).toBe('2 Players');
      expect(g?.difficulty).toBe('intermediate');
      expect(g?.available).toBe(true);
    }
  });
});
