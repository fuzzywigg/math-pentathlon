/**
 * Wave 67 leftover after tip/#324 — Contig media cell 36px scoped.
 * Soft toContain 36px existed; lock @media + .contig-cell dims. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject media cell 36 scoped', () => {
  it('pins @media 600px contig-cell 36px square leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.contig-cell\s*\{[\s\S]*?width:\s*36px/
    );
    expect(css).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.contig-cell\s*\{[\s\S]*?height:\s*36px/
    );
  });
});
