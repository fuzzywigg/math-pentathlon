/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig board shadow CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject board shadow', () => {
  it('boards use gap/padding/radius/shadow leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-board');
    expect(css).toContain('gap: 2px');
    expect(css).toContain('padding: 4px');
    expect(css).toContain('border-radius: 8px');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(0,0,0,0.15)');
  });
});
