/**
 * Wave 68 leftover after tip/#337 — Contig expr-list gap 0.5rem.
 * Soft display grid existed; lock gap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject expr-list gap 05', () => {
  it('pins contig-expr-list gap 0.5rem leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-expr-list\s*\{[\s\S]*?gap:\s*0\.5rem/);
  });
});
