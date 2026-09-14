/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab op-btn padding.
 * Wave59 pins border #ddd; deepen 0.75rem 1.25rem pad leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 63 fab — inject op-btn pad', () => {
  it('op buttons use 0.75rem 1.25rem padding', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-op-btn');
    expect(css).toContain('padding: 0.75rem 1.25rem');
  });
});
