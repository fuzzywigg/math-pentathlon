/**
 * Overnight HEAVY leftovers after #236 — Contig inject mobile media leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 53 contig — inject media', () => {
  it('shrinks cells to 36px under max-width 600px', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toContain('width: 36px');
    expect(css).toContain('height: 36px');
  });
});
