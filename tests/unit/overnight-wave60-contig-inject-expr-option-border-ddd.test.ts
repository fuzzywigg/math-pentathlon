/**
 * Wave 60 leftover after #282 — Contig expr-option base border. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject expr-option border ddd', () => {
  it('pins base border leftover (not hover)', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-expr-option\s*\{[\s\S]*?border:\s*2px solid #ddd/);
  });
});
