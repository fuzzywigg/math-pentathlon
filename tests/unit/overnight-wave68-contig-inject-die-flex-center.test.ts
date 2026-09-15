/**
 * Wave 68 leftover after tip/#337 — Contig die flex centering.
 * Soft 60px/orange border existed; lock flex center leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject die flex center', () => {
  it('pins contig-die display flex + align/justify center leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?display:\s*flex/);
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?align-items:\s*center/);
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?justify-content:\s*center/);
  });
});
