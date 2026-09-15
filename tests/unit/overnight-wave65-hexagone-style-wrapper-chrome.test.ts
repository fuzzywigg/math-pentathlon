/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone wrapper chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style wrapper chrome', () => {
  it('wrapper gap 1.5rem + box-sizing', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-wrapper {');
    expect(css).toMatch(/\.hex-a-gone-wrapper\s*\{[^}]*gap:\s*1\.5rem/s);
    expect(css).toMatch(/\.hex-a-gone-wrapper\s*\{[^}]*box-sizing:\s*border-box/s);
  });
});
