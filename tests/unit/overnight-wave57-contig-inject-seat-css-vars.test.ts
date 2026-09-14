/**
 * Wave 57 leftover after #267 — Contig seat CSS vars in inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 57 contig — inject seat css vars', () => {
  it('pins player1/player2 CSS vars + fallbacks', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-cell-p1');
    expect(css).toContain('.contig-cell-p2');
    expect(css).toContain('var(--color-player1, #2196f3)');
    expect(css).toContain('var(--color-player2, #f44336)');
  });
});
