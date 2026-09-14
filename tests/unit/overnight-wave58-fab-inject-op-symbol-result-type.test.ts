/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — Fab op-symbol / op-result type scale.
 * Wave53 asserts DOM nodes; deepen inject font-size/margin leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 58 fab — inject op symbol result type', () => {
  it('op-symbol is 1.5rem and op-result has 0.25rem top margin', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-op-symbol');
    expect(css).toContain('font-size: 1.5rem');
    expect(css).toContain('.fab-op-result');
    expect(css).toContain('margin-top: 0.25rem');
  });
});
