/**
 * Wave 67 leftover after tip/#316 — Contig scores gap 2rem chrome.
 * Soft score fills existed; lock scores flex gap/justify leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style scores gap 2rem', () => {
  it('pins contig-scores justify center + gap 2rem leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-scores\s*\{[\s\S]*?justify-content:\s*center/
    );
    expect(css).toMatch(/\.contig-scores\s*\{[\s\S]*?gap:\s*2rem/);
    expect(css).toMatch(/\.contig-scores\s*\{[\s\S]*?padding:\s*0\.5rem/);
  });
});
