/**
 * Wave 67 leftover after tip/#316 — Contig media cell 36px leftover.
 * Soft media die 50 / value 12 existed; lock cell 36px under 600px. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 67 contig — inject media cell 36px', () => {
  it('pins @media 600px contig-cell 36px dims leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.contig-cell\s*\{[\s\S]*?width:\s*36px/
    );
    expect(css).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.contig-cell\s*\{[\s\S]*?height:\s*36px/
    );
  });
});
