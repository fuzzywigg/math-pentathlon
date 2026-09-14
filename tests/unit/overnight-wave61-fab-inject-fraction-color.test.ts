/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab .fab-fraction color.
 * Wave59 pins section-header #333; deepen fraction token leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject fraction color', () => {
  it('fraction token is #333', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-fraction');
    expect(css).toContain('color: #333');
  });
});
