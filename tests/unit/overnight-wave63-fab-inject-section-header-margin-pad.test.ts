/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab section-header margin/pad.
 * Wave59 pins type scale; deepen margin + padding-bottom leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 63 fab — inject section-header margin pad', () => {
  it('section header has 0.75rem bottom margin and 0.5rem pad', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-section-header');
    expect(css).toContain('margin: 0 0 0.75rem 0');
    expect(css).toContain('padding-bottom: 0.5rem');
  });
});
