/**
 * Wave 65 leftover after tip/#305 — fab × fiar residual handshake.
 * Distinct from wave63 selected/titles; deepen strong labels + AI violet. Tests-only.
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

describe('Wave 65 handshake — fab × fiar residual', () => {
  it('mounts turn strong labels + pathways + AI violet + pulse pair', () => {
    injectFabStyles();
    injectFiarStyles();
    const fabCss = document.getElementById('fab-styles')!.textContent || '';
    const fiarCss = document.getElementById('fiar-styles')!.textContent || '';

    expect(fabCss).toMatch(
      /\[data-opponent="ai"\] \.fab-answer-player2\s*\{[\s\S]*?background:\s*#ddd6fe/
    );
    expect(fiarCss).toContain('0%, 100% { opacity: 0.5; }');
    expect(fiarCss).toContain(
      'linear-gradient(135deg, #ffd700 0%, #ffec8b 100%)'
    );

    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence')?.message
    ).toContain('<strong>Select Bars:</strong>');
    expect(
      fiarTutorial.steps.find((s) => s.id === 'objective')?.message
    ).toContain(
      '<p>Get four of your chips in a row along connected pathways!</p>'
    );
  });
});
