/**
 * Wave 68 leftover after tip/#337 — Contig expressions padding 1rem.
 * Soft max-width/margin auto existed; lock padding leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject expressions pad 1rem', () => {
  it('pins contig-expressions padding 1rem leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-expressions\s*\{[\s\S]*?padding:\s*1rem/);
  });
});
