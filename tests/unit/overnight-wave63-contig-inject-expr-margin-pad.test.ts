/**
 * Wave 63 Contig/SD residual after tip #301 — Contig expressions margin/pad leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 63 contig — inject expr margin pad', () => {
  it('pins margin auto + padding 1rem leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-expressions\s*\{[\s\S]*?margin:\s*0 auto/);
    expect(css).toMatch(/\.contig-expressions\s*\{[\s\S]*?padding:\s*1rem/);
  });
});
