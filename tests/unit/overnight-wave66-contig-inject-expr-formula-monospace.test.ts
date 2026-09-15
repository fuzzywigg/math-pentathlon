/**
 * Wave 66 leftover after tip/#316 — Contig expr-formula monospace leftover.
 * Soft formula fontsize existed; lock monospace + #666. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject expr-formula monospace', () => {
  it('pins expr-formula monospace #666 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.expr-formula\s*\{[\s\S]*?font-family:\s*monospace/
    );
    expect(css).toMatch(/\.expr-formula\s*\{[\s\S]*?color:\s*#666/);
  });
});
