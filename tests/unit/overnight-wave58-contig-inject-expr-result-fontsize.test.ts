/**
 * Wave 58 leftover after #275 — Contig expr-result font-size inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — inject expr-result', () => {
  it('pins .expr-result 1.5rem bold leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.expr-result');
    expect(css).toContain('1.5rem');
    expect(css).toMatch(/\.expr-result\s*\{[\s\S]*?font-weight:\s*bold/);
  });
});
