/**
 * Wave 63 Contig/SD residual after tip #301 — Contig roll hover/disabled chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 contig — style roll hover disabled', () => {
  it('pins hover lift and disabled opacity leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-roll-btn:hover:not\(:disabled\)\s*\{[\s\S]*?translateY\(-1px\)/
    );
    expect(css).toMatch(
      /\.contig-roll-btn:hover:not\(:disabled\)\s*\{[\s\S]*?var\(--color-primary-dark\)/
    );
    expect(css).toMatch(/\.contig-roll-btn:disabled\s*\{[\s\S]*?opacity:\s*0\.5/);
    expect(css).toMatch(/\.contig-roll-btn:disabled\s*\{[\s\S]*?cursor:\s*not-allowed/);
  });
});
