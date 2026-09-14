/**
 * Wave 56 leftover after #243 — Contig inject no-moves orange residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject no-moves orange', () => {
  it('pins .contig-no-moves bg and paragraph color', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')!.textContent!;
    expect(css).toContain('.contig-no-moves');
    expect(css).toContain('#fff3e0');
    expect(css).toContain('#e65100');
  });
});
