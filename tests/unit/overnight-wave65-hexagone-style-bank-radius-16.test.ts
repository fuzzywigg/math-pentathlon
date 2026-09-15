/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone bank border-radius 16px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style bank radius 16', () => {
  it('bank border-radius 16px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-bank\s*\{[^}]*border-radius:\s*16px/s);
  });
});
