/**
 * Overnight HEAVY leftovers after #236 — Contig inject valid green leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 53 contig — inject valid green', () => {
  it('paints valid cells #c8e6c9 with hover #4caf50', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-cell-valid');
    expect(css).toContain('#c8e6c9');
    expect(css).toContain('#4caf50');
  });
});
