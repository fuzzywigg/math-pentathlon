/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — Fab bar-group + wrapper transition.
 * Distinct from wave57 selected/opacity tokens. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 58 fab — inject bar group transition', () => {
  it('bar-group uses #f9f9f9 wrap and wrapper 0.15s transition', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-bar-group');
    expect(css).toContain('background: #f9f9f9');
    expect(css).toContain('flex-wrap: wrap');
    expect(css).toContain('padding: 4px');
    expect(css).toContain('transition: all 0.15s ease');
  });
});
