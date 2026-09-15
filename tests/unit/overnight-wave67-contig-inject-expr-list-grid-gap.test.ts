/**
 * Wave 67 leftover after tip/#316 — Contig expr-list grid/gap leftover.
 * Soft minmax contains existed; lock display grid + gap 0.5rem. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject expr-list grid gap', () => {
  it('pins expr-list display grid + gap 0.5rem + minmax 150', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-expr-list\s*\{[\s\S]*?display:\s*grid/
    );
    expect(css).toMatch(/\.contig-expr-list\s*\{[\s\S]*?gap:\s*0\.5rem/);
    expect(css).toMatch(
      /\.contig-expr-list\s*\{[\s\S]*?minmax\(150px, 1fr\)/
    );
  });
});
