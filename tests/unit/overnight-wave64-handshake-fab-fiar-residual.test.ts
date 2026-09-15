/**
 * Overnight TOKENMAXX HEAVY leftovers after #305 — fab × fiar residual handshake.
 * Distinct from wave63 selected-important + titles; deepen ops verbs × strategy. Tests-only.
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

describe('Wave 64 handshake — fab × fiar residual', () => {
  it('op-btn radius + chips-info pad mount with exact tutorial leftovers', () => {
    injectFabStyles();
    injectFiarStyles();
    const fabCss = document.getElementById('fab-styles')!.textContent || '';
    const fiarCss = document.getElementById('fiar-styles')!.textContent || '';
    expect(fabCss).toContain('.fab-op-btn');
    expect(fabCss).toContain('border-radius: 8px');
    expect(fabCss).toContain('background: var(--color-player1, #2196f3)');
    expect(fiarCss).toContain('.fiar-chips-info');
    expect(fiarCss).toContain('padding: 0.5rem');

    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'operations')?.message
    ).toContain('Multiply fractions');
    expect(
      fiarTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('Control the center of the board');
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('claim those answer bars!');
    expect(
      fiarTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('get four in a row!');
  });
});
