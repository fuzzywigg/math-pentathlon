/**
 * Wave 66 leftover after tip/#316 — Contig die border orange leftover.
 * Soft die shadow/radius existed; lock 3px #f57c00 + cream bg. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject die border orange', () => {
  it('pins die cream bg + 3px orange border leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?background:\s*#fff8e1/);
    expect(css).toMatch(
      /\.contig-die\s*\{[\s\S]*?border:\s*3px solid #f57c00/
    );
  });
});
