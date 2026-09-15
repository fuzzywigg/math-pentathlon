/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone players gap 2rem. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style players gap 2rem', () => {
  it('hex-a-gone-players gap 2rem exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-players\s*\{[^}]*gap:\s*2rem/s);
  });
});
