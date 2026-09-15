/**
 * Wave 67 leftover after tip/#336 — fab × fiar residual handshake.
 * Distinct from wave65 strong/violet; deepen Finish CTAs + human seats. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 handshake — fab × fiar residual', () => {
  it('mounts Finish CTAs + human seats + chips-info + glow pair', () => {
    injectFabStyles();
    injectFiarStyles();
    const fabCss = document.getElementById('fab-styles')!.textContent || '';
    const fiarCss = document.getElementById('fiar-styles')!.textContent || '';

    expect(fabCss).toMatch(
      /\.fab-answer-player1\s*\{[\s\S]*?background:\s*#bbdefb/
    );
    expect(fiarCss).toMatch(
      /\.fiar-chips-info\s*\{[\s\S]*?font-size:\s*0\.9rem/
    );
    expect(fabCss).toContain('@keyframes fab-glow');
    expect(fiarCss).toContain('@keyframes winner-glow');

    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('Click <strong>Finish</strong> and claim those answer bars!');
    expect(
      fiarTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('Click <strong>Finish</strong> and get four in a row!');
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'operations')?.message
    ).toContain('<strong>+</strong> Add fractions');
  });
});
