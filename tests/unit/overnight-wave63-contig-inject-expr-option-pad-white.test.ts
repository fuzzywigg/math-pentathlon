/**
 * Wave 63 Contig/SD residual after tip #301 — Contig expr-option pad/white leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 63 contig — inject expr-option pad white', () => {
  it('pins padding/white/gap leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-expr-option\s*\{[\s\S]*?padding:\s*0\.75rem/);
    expect(css).toMatch(/\.contig-expr-option\s*\{[\s\S]*?background:\s*white/);
    expect(css).toMatch(/\.contig-expr-list\s*\{[\s\S]*?gap:\s*0\.5rem/);
  });
});
