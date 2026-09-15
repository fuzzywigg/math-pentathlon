/**
 * Wave 68 leftover after tip/#337 — Contig score pad + radius.
 * Soft seat fills existed; lock pad/radius leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style score pad radius', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-score\s*\{[\s\S]*?padding:\s*0\.5rem 1rem/);
    expect(css).toMatch(/\.contig-score\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
