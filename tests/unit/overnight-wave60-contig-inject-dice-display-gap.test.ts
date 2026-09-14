/**
 * Wave 60 leftover after #282 — Contig dice-display gap. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject dice-display gap', () => {
  it('pins gap leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-dice-display\s*\{[\s\S]*?gap:\s*1rem/);
  });
});
