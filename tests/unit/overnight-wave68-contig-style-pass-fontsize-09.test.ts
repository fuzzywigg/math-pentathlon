/**
 * Wave 68 leftover after tip/#337 — Contig pass font-size 0.9rem.
 * Soft pad/min-width existed; lock font-size leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style pass fontsize 09', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-pass-btn\s*\{[\s\S]*?font-size:\s*0\.9rem/);
  });
});
