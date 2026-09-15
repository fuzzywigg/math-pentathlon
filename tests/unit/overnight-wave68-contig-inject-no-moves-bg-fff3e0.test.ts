/**
 * Wave 68 leftover after tip/#337 — Contig no-moves #fff3e0 scoped.
 * Soft contain #fff3e0 existed; lock rule-scoped fill leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject no-moves bg fff3e0', () => {
  it('pins contig-no-moves background #fff3e0 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-no-moves\s*\{[\s\S]*?background:\s*#fff3e0/);
  });
});
