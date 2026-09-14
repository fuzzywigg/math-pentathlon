/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab op-disabled inject class.
 * Wave57 covers generic opacity/cursor; deepen .fab-op-disabled selector. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject op-disabled class', () => {
  it('op-disabled class pairs opacity with not-allowed cursor', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-op-disabled');
    expect(css).toContain('opacity: 0.4');
    expect(css).toContain('cursor: not-allowed');
  });
});
