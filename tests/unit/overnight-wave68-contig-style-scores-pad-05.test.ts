/**
 * Wave 68 leftover after tip/#337 — Contig scores padding 0.5rem.
 * Soft display/gap existed; lock padding leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style scores pad 05', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-scores\s*\{[\s\S]*?padding:\s*0\.5rem/);
  });
});
