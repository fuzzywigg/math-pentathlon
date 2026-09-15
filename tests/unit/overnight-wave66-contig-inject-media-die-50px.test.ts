/**
 * Wave 66 leftover after tip/#316 — Contig media die 50px leftover.
 * Soft media font-size 32 existed; lock width/height 50px. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject media die 50px', () => {
  it('pins @media 600px contig-die 50px dims leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.contig-die\s*\{[\s\S]*?width:\s*50px/
    );
    expect(css).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.contig-die\s*\{[\s\S]*?height:\s*50px/
    );
  });
});
