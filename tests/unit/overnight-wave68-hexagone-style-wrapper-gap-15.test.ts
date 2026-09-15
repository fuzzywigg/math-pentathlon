/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone wrapper gap 1.5rem. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style wrapper gap 1.5', () => {
  it('hex-a-gone-wrapper gap 1.5rem + padding 1.5rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-wrapper\s*\{[^}]*gap:\s*1\.5rem/s);
    expect(css).toMatch(/\.hex-a-gone-wrapper\s*\{[^}]*padding:\s*1\.5rem/s);
  });
});
