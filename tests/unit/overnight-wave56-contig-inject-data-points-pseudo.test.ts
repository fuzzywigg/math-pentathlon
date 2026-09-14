/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig data-points pseudo. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject data-points pseudo', () => {
  it('::after uses attr(data-points) corner badge leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('content: attr(data-points)');
    expect(css).toContain('top: 2px');
    expect(css).toContain('right: 2px');
    expect(css).toContain('font-size: 10px');
  });
});
