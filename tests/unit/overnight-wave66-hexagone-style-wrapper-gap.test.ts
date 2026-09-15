/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone wrapper gap exact.
 * Soft board width; lock wrapper gap/padding leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hexagone — style wrapper gap', () => {
  it('wrapper flex column + gap 1.5rem + padding exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-wrapper {');
    expect(css).toMatch(/\.hex-a-gone-wrapper\s*\{[^}]*gap:\s*1\.5rem/s);
    expect(css).toMatch(/\.hex-a-gone-wrapper\s*\{[^}]*padding:\s*1\.5rem/s);
    expect(css).toMatch(/\.hex-a-gone-wrapper\s*\{[^}]*flex-direction:\s*column/s);
  });
});
