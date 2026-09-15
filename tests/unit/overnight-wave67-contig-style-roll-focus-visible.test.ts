/**
 * Wave 67 leftover after tip/#324 — Contig roll focus-visible outline.
 * Soft roll pad/disabled existed; lock focus outline leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style roll focus-visible', () => {
  it('pins contig-roll-btn focus-visible outline leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-roll-btn:focus-visible\s*\{[\s\S]*?outline:\s*2px solid var\(--color-primary\)/
    );
    expect(css).toMatch(
      /\.contig-roll-btn:focus-visible\s*\{[\s\S]*?outline-offset:\s*2px/
    );
  });
});
