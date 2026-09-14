/**
 * Wave 57 leftover after #267 — Contig .contig-die inject chrome tokens. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 57 contig — inject die chrome', () => {
  it('pins die size + cream/orange tokens', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-die');
    expect(css).toContain('#fff8e1');
    expect(css).toContain('#f57c00');
    expect(css).toContain('60px');
  });
});
