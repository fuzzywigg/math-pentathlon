/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab op-placeholder / equals colors.
 * Wave53 asserts DOM ?/= nodes; deepen inject #999/#666 leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject op placeholder equals', () => {
  it('placeholder is #999 and equals is #666', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-op-placeholder');
    expect(css).toContain('.fab-equals');
    expect(css).toContain('color: #999');
    expect(css).toContain('color: #666');
  });
});
