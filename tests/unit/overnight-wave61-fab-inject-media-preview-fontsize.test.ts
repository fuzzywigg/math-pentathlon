/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab media preview font-size.
 * Wave56 pins mobile 1fr columns; deepen preview 1.2rem leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject media preview fontsize', () => {
  it('mobile media shrinks operation-preview to 1.2rem', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('@media (max-width: 768px)');
    expect(css).toContain('.fab-operation-preview');
    expect(css).toContain('font-size: 1.2rem');
  });
});
