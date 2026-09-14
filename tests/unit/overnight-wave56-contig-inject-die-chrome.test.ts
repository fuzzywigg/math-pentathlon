/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig die chrome CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject die chrome', () => {
  it('paints die cream face and orange border sizes', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-die');
    expect(css).toContain('#fff8e1');
    expect(css).toContain('#f57c00');
    expect(css).toContain('width: 60px');
    expect(css).toContain('height: 60px');
    expect(css).toContain('font-size: 40px');
  });
});
