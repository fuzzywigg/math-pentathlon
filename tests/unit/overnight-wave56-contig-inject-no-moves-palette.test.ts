/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig no-moves palette. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject no-moves palette', () => {
  it('no-moves panel uses warm orange leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-no-moves');
    expect(css).toContain('background: #fff3e0');
    expect(css).toContain('color: #e65100');
  });
});
