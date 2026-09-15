/**
 * Wave 66 leftover after tip/#316 — Contig expr-result 1.5rem leftover.
 * Soft formula/points existed; lock result size/weight/color. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject expr-result 1.5rem', () => {
  it('pins expr-result 1.5rem bold #333 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.expr-result\s*\{[\s\S]*?font-size:\s*1\.5rem/);
    expect(css).toMatch(/\.expr-result\s*\{[\s\S]*?font-weight:\s*bold/);
    expect(css).toMatch(/\.expr-result\s*\{[\s\S]*?color:\s*#333/);
  });
});
