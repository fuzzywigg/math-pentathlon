/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig expr list grid. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject expr list grid', () => {
  it('expr list grid + monospace formula leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('minmax(150px, 1fr)');
    expect(css).toContain('font-family: monospace');
    expect(css).toContain('.contig-expr-header');
    expect(css).toContain('color: #555');
  });
});
