/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — Fab pulse keyframe body.
 * Wave57 asserts animation usage name; deepen rgba body literals. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 58 fab — inject pulse keyframe body', () => {
  it('fab-pulse keyframes expand green ring then fade', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('@keyframes fab-pulse');
    expect(css).toContain('0 0 0 0 rgba(76, 175, 80, 0.4)');
    expect(css).toContain('0 0 0 8px rgba(76, 175, 80, 0)');
  });
});
