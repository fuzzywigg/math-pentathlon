/**
 * Wave 60 leftover after #282 — Contig expr-formula font-size. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject expr-formula font-size', () => {
  it('pins 0.85rem leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.expr-formula\s*\{[\s\S]*?font-size:\s*0\.85rem/);
  });
});
