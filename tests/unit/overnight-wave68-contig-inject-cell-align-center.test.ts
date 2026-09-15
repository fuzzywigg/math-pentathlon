/**
 * Wave 68 leftover after tip/#337 — Contig cell align-items center.
 * Soft display flex leftover nearby; lock align-items. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject cell align center', () => {
  it('pins contig-cell align-items center leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell\s*\{[\s\S]*?align-items:\s*center/);
  });
});
