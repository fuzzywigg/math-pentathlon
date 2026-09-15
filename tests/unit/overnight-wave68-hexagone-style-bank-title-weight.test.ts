/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone bank-title weight 600. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style bank title weight', () => {
  it('bank-title font-weight 600 + color 2d3748', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-bank-title\s*\{[^}]*font-weight:\s*600/s);
    expect(css).toMatch(/\.hex-a-gone-bank-title\s*\{[^}]*color:\s*#2d3748/s);
  });
});
