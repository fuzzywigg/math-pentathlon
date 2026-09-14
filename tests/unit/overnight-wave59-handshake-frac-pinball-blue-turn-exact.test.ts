/**
 * Wave 59 leftover after #272 — Handshake exact Blue turn + inject fills.
 * Distinct from wave57 Red turn / hover fills. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame as initFrac } from '../../src/games/frac-fact/game-controller';
import { initGame as initPinball } from '../../src/games/fraction-pinball/game-controller';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 59 handshake — frac/pinball blue turn', () => {
  it('mounts exact Blue turns, secondary fills, and welcome score paras', () => {
    injectFracFactStyles();
    injectFractionPinballStyles();
    expect(document.getElementById('frac-fact-styles')?.textContent).toMatch(
      /background:\s*#9e9e9e/
    );
    expect(
      document.getElementById('fraction-pinball-styles')?.textContent
    ).toMatch(/\.pinball-continue-btn:hover[\s\S]*#1976d2/);

    const fracRoot = document.createElement('div');
    const pinRoot = document.createElement('div');
    document.body.append(fracRoot, pinRoot);
    initFrac(fracRoot);
    initPinball(pinRoot);
    expect(fracRoot.querySelector('.frac-status')?.textContent).toBe(
      "🔵 Blue's turn"
    );
    expect(pinRoot.querySelector('.pinball-status')?.textContent).toBe(
      "🔵 Blue's turn"
    );

    expect(
      fracFactTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain(
      'Score more points than your opponent by correctly solving fraction problems!'
    );
    expect(
      fractionPinballTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain(
      'Score points by correctly converting between fractions and decimals!'
    );
  });
});
