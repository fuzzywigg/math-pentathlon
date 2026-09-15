/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone coverage color exact.
 * Soft coverage mount; lock #4a5568 + center leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hexagone — style coverage color', () => {
  it('coverage color #4a5568 + text-align center exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-coverage {');
    expect(css).toMatch(/\.hex-a-gone-coverage\s*\{[^}]*color:\s*#4a5568/s);
    expect(css).toMatch(/\.hex-a-gone-coverage\s*\{[^}]*text-align:\s*center/s);
  });
});
