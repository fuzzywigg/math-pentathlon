/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig media die shrink. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject media die shrink', () => {
  it('shrinks die and value under 600px media leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toContain('width: 50px');
    expect(css).toContain('font-size: 32px');
    expect(css).toContain('font-size: 12px');
    expect(css).toContain('minmax(120px, 1fr)');
  });
});
