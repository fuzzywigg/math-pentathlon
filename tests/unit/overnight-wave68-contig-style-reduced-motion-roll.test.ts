/**
 * Wave 68 leftover after tip/#337 — Contig+SD reduced-motion roll transform none.
 * Soft hover lift existed; lock prefers-reduced-motion leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style reduced-motion roll', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toMatch(
      /\.sd-roll-btn:hover:not\(:disabled\),\s*\n\s*\.contig-roll-btn:hover:not\(:disabled\)\s*\{[\s\S]*?transform:\s*none/
    );
  });
});
