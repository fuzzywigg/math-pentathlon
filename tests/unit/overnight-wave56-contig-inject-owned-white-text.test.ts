/**
 * Wave 56 leftover after #243 — Contig inject owned white text residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject owned white text', () => {
  it('forces white .contig-cell-value on p1/p2 owned cells', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')!.textContent!;
    expect(css).toMatch(/\.contig-cell-p1 \.contig-cell-value\s*\{[\s\S]*?color:\s*white/);
    expect(css).toMatch(/\.contig-cell-p2 \.contig-cell-value\s*\{[\s\S]*?color:\s*white/);
  });
});
