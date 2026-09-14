/**
 * Wave 64 leftover after tip/#303 — Sum roll-btn hover lift chrome.
 * Contig hover lift covered elsewhere; deepen Sum hover leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 sum — style roll hover lift', () => {
  it('pins sd-roll-btn hover translateY + primary-dark', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-roll-btn:hover:not\(:disabled\)\s*\{[\s\S]*?translateY\(-1px\)/
    );
    expect(css).toMatch(
      /\.sd-roll-btn:hover:not\(:disabled\)\s*\{[\s\S]*?var\(--color-primary-dark\)/
    );
    expect(css).toMatch(
      /\.sd-roll-btn:hover:not\(:disabled\)\s*\{[\s\S]*?var\(--shadow-md\)/
    );
  });
});
