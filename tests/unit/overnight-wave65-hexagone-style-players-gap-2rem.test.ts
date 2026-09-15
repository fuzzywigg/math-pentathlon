/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone players gap 2rem. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style players gap 2rem', () => {
  it('players gap 2rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-players\s*\{[^}]*gap:\s*2rem/s);
  });
});
