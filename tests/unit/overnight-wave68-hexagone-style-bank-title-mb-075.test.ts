/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style bank-title-mb-075. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style bank-title-mb-075', () => {
  it('.hex-a-gone-bank-title locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-bank-title\s*\{[^}]*margin-bottom:\s*0\.75rem/s);
  });
});
