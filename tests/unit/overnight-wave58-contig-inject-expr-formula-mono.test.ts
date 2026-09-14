/**
 * Wave 58 leftover after #275 — Contig expr-formula mono inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — inject expr-formula', () => {
  it('pins monospace + #666 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.expr-formula');
    expect(css).toContain('monospace');
    expect(css).toContain('#666');
  });
});
