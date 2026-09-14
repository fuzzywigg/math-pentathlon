/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab bar-selected !important fill.
 * Wave54/61 pin selected ring; deepen #fff3e0 !important leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 63 fab — inject bar-selected important', () => {
  it('selected bar uses #fff3e0 !important fill', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-bar-selected');
    expect(css).toContain('background: #fff3e0 !important');
  });
});
