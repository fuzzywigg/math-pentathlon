/**
 * Wave 67 leftover after tip/#324 — Contig expr-list display grid.
 * Soft minmax(150px) existed; lock display grid leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject expr-list display grid', () => {
  it('pins contig-expr-list display grid leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-expr-list\s*\{[\s\S]*?display:\s*grid/);
  });
});
