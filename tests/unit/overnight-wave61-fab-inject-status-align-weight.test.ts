/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab status align/weight.
 * Wave55 loosely hits 1.2rem; deepen .fab-status align/pad/weight. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject status align weight', () => {
  it('status is centered 1.2rem weight 500 with 1rem pad', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-status');
    expect(css).toContain('text-align: center');
    expect(css).toContain('padding: 1rem');
    expect(css).toContain('font-size: 1.2rem');
    expect(css).toContain('font-weight: 500');
  });
});
