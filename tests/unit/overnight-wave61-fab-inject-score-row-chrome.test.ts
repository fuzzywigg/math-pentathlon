/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab .fab-score row chrome.
 * Wave59 pins score-value; deepen seat score flex/gap/weight leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject score row chrome', () => {
  it('score row is flex with 0.5rem gap and weight 500', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-score');
    expect(css).toContain('align-items: center');
    expect(css).toContain('gap: 0.5rem');
    expect(css).toContain('font-weight: 500');
  });
});
