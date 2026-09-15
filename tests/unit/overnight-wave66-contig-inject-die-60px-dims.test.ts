/**
 * Wave 66 leftover after tip/#316 — Contig die 60px dims leftover.
 * Soft font-size 40 / radius / shadow existed; lock width/height 60. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject die 60px dims', () => {
  it('pins contig-die width/height 60px leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?width:\s*60px/);
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?height:\s*60px/);
  });
});
