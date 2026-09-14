/**
 * Wave 60 leftover after #282 — Contig die radius/shadow. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject die radius shadow', () => {
  it('pins border-radius and box-shadow leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?border-radius:\s*12px/);
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?box-shadow:\s*0 4px 8px/);
  });
});
