/**
 * Wave 58 leftover after #275 — Contig expr-option hover border inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — inject expr-option hover', () => {
  it('pins hover border #4caf50 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-expr-option:hover');
    expect(css).toContain('#4caf50');
    expect(css).toContain('#c8e6c9');
  });
});
