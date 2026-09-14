/**
 * Wave 56 leftover after #243 — Contig inject die amber chrome residual.
 * Cell-size / valid-green / media covered in wave53; die amber was not. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 56 contig — inject die amber', () => {
  it('pins .contig-die amber fill, orange border, and 60px size', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')!.textContent!;
    expect(css).toContain('.contig-die');
    expect(css).toContain('#fff8e1');
    expect(css).toContain('#f57c00');
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?width:\s*60px/);
    expect(css).toMatch(/\.contig-die\s*\{[\s\S]*?height:\s*60px/);
  });
});
