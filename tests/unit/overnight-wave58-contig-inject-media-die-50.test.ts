/**
 * Wave 58 leftover after #275 — Contig media die 50px inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 58 contig — inject media die', () => {
  it('pins max-width 600px die 50px leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toMatch(/@media \(max-width: 600px\)[\s\S]*?\.contig-die\s*\{[\s\S]*?50px/);
  });
});
