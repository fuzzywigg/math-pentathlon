/**
 * Wave 67 leftover after tip/#316 — Contig media expr minmax 120 leftover.
 * Soft desktop minmax 150 existed; lock media minmax(120px). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject media expr minmax 120', () => {
  it('pins @media 600px expr-list minmax(120px) leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.contig-expr-list\s*\{[\s\S]*?minmax\(120px, 1fr\)/
    );
  });
});
