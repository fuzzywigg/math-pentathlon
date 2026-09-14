/**
 * Wave 57 leftover after #267 — Contig data-points ::after inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 57 contig — inject data-points pseudo', () => {
  it('pins attr(data-points) ::after chrome', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-cell-valid[data-points]::after');
    expect(css).toContain('attr(data-points)');
    expect(css).toContain('#4caf50');
  });
});
