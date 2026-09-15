/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone bank radius 16. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style bank radius 16', () => {
  it('hex-a-gone-bank border-radius 16px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-bank\s*\{[^}]*border-radius:\s*16px/s);
  });
});
