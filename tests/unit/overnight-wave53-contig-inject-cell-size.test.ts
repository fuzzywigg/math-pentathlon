/**
 * Overnight HEAVY leftovers after #236 — Contig inject 48px cell leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 53 contig — inject cell size', () => {
  it('injects .contig-cell 48px square before the mobile query', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell \{[^}]*width: 48px;[^}]*height: 48px;/s);
  });
});
