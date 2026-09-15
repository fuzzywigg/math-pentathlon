/**
 * Wave 68 leftover after tip/#337 — Contig row display flex.
 * Soft row gap 2px existed; lock display flex leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject row display flex', () => {
  it('pins contig-row display flex leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-row\s*\{[\s\S]*?display:\s*flex/);
  });
});
