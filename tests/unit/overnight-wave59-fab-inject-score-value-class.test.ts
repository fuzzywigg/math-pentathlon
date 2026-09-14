/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab score-value inject class.
 * Waves 53–54 assert DOM score text; deepen .fab-score-value selector. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject score-value class', () => {
  it('score-value class is bold 1.25rem in inject blob', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-score-value');
    expect(css).toContain('font-size: 1.25rem');
    expect(css).toContain('font-weight: bold');
  });
});
