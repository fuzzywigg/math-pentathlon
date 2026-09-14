/**
 * Wave 57 leftover after #267 — Contig expr-list grid minmax inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 57 contig — inject expr-list grid', () => {
  it('pins desktop 150px and mobile 120px minmax', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('minmax(150px, 1fr)');
    expect(css).toContain('minmax(120px, 1fr)');
  });
});
