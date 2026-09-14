/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab btn border-none + primary white.
 * Wave59 pins secondary fills; deepen btn border:none + primary color white. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 63 fab — inject btn border none primary white', () => {
  it('fab-btn has border none; primary text is white', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-btn');
    expect(css).toContain('border: none');
    expect(css).toContain('.fab-btn-primary');
    expect(css).toContain('color: white');
  });
});
