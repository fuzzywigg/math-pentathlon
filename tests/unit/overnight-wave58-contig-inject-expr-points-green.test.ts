/**
 * Wave 58 leftover after #275 — Contig expr-points green inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — inject expr-points', () => {
  it('pins .expr-points #4caf50 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.expr-points');
    expect(css).toMatch(/\.expr-points\s*\{[\s\S]*?#4caf50/);
  });
});
