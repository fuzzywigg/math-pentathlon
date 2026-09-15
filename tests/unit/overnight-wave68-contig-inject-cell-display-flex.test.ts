/**
 * Wave 68 leftover after tip/#337 — Contig cell display flex.
 * Soft 48px / radius existed; lock display flex leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject cell display flex', () => {
  it('pins contig-cell display flex leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?display:\s*flex/);
  });
});
