/**
 * Wave 66 leftover after tip/#316 — fab × fiar residual handshake.
 * Distinct from wave65 AI violet + pathways; deepen ops strong + Finish + seat violet. Tests-only.
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

describe('Wave 66 handshake — fab × fiar residual', () => {
  it('mounts ops strong + Finish claim + seat violet + pulse-highlight', () => {
    injectFabStyles();
    injectFiarStyles();
    const fabCss = document.getElementById('fab-styles')!.textContent || '';
    const fiarCss = document.getElementById('fiar-styles')!.textContent || '';

    expect(fabCss).toMatch(
      /\[data-opponent="ai"\]\[data-ai-seat="player1"\] \.fab-answer-player1\s*\{[\s\S]*?background:\s*#ddd6fe/
    );
    expect(fiarCss).toMatch(
      /\.pulse-highlight\s*\{[\s\S]*?animation:\s*fiar-pulse 1s ease-in-out infinite/
    );

    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'operations')?.message
    ).toContain('<li><strong>+</strong> Add fractions</li>');
    expect(
      fiarTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain(
      '<p>Click <strong>Finish</strong> and get four in a row!</p>'
    );
  });
});
