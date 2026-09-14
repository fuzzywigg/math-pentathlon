/**
 * Wave 63 Contig/SD residual after tip #301 — Contig/SD reduced-motion chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 contig — style reduced motion', () => {
  it('pins reduced-motion winner/roll leftovers for contig+sd', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('.sd-winner-banner');
    expect(css).toContain('.contig-winner-banner');
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*?\.contig-roll-btn:hover:not\(:disabled\)[\s\S]*?transform:\s*none/
    );
  });
});
