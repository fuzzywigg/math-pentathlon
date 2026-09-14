/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab bar-used inject class.
 * Wave55 covers used bar SVG fill; deepen .fab-bar-used selector. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject bar-used class', () => {
  it('bar-used class is present in fab-styles blob', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-bar-used');
    expect(css).toContain('opacity: 0.4');
  });
});
