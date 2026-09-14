/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — fab × fiar residual handshake.
 * Distinct from wave61 gap/pad handshake; deepen selected !important + titles. Tests-only.
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

describe('Wave 63 handshake — fab × fiar residual', () => {
  it('bar-selected important + exact tutorial titles mount together', () => {
    injectFabStyles();
    injectFiarStyles();
    const fabCss = document.getElementById('fab-styles')!.textContent || '';
    const fiarCss = document.getElementById('fiar-styles')!.textContent || '';
    expect(fabCss).toContain('background: #fff3e0 !important');
    expect(fabCss).toContain('padding: 0.75rem 1.25rem');
    expect(fiarCss).toContain('.fiar-board-container');
    expect(fiarCss).toContain('filter: drop-shadow');

    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence')?.title
    ).toBe('Turn Sequence');
    expect(
      fiarTutorial.steps.find((s) => s.id === 'movement-rules')?.title
    ).toBe('Movement Rules');
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'complete')?.title
    ).toBe('Ready to Play!');
    expect(fiarTutorial.steps.find((s) => s.id === 'complete')?.title).toBe(
      'Ready to Play!'
    );
  });
});
