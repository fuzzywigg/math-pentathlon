/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style bank-pad-125. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style bank-pad-125', () => {
  it('.hex-a-gone-bank locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-bank\s*\{[^}]*padding:\s*1\.25rem/s);
  });
});
