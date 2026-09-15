/**
 * Wave 67 leftover after tip/#316 — Contig roll min-width 120 chrome.
 * Soft disabled opacity existed; lock min-width + primary fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style roll minwidth 120', () => {
  it('pins contig-roll-btn min-width 120px + primary fill', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-roll-btn\s*\{[\s\S]*?min-width:\s*120px/);
    expect(css).toMatch(
      /\.contig-roll-btn\s*\{[\s\S]*?background-color:\s*var\(--color-primary\)/
    );
  });
});
