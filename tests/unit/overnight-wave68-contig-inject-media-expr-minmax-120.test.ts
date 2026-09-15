/**
 * Wave 68 leftover after tip/#337 — Contig media expr-list minmax 120.
 * Soft contain minmax(120px) existed; lock scoped media leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject media expr minmax 120', () => {
  it('pins @media 600px contig-expr-list minmax(120px) leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.contig-expr-list\s*\{[\s\S]*?minmax\(120px, 1fr\)/
    );
  });
});
