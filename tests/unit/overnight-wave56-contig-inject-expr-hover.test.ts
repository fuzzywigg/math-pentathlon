/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig expr hover CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject expr hover', () => {
  it('expr option hover uses valid green leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-expr-option:hover');
    expect(css).toContain('border-color: #4caf50');
    expect(css).toContain('background: #c8e6c9');
  });
});
