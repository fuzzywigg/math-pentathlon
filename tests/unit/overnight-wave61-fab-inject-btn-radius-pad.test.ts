/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab .fab-btn radius/pad.
 * Wave54/59 pin primary/secondary fills; deepen base btn chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject btn radius pad', () => {
  it('base fab-btn has 6px radius and 0.5rem/1rem pad', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-btn');
    expect(css).toContain('border-radius: 6px');
    expect(css).toContain('padding: 0.5rem 1rem');
    expect(css).toContain('font-weight: 500');
  });
});
