/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — Fab glow keyframe body.
 * Wave57 asserts animation: fab-glow name; deepen gold shadow bodies. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 58 fab — inject glow keyframe body', () => {
  it('fab-glow keyframes alternate gold box-shadow strength', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('@keyframes fab-glow');
    expect(css).toContain('0 0 10px rgba(255,215,0,0.5)');
    expect(css).toContain('0 0 20px rgba(255,215,0,0.8)');
  });
});
