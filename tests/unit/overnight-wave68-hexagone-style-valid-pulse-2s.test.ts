/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style valid-pulse-2s. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style valid-pulse-2s', () => {
  it('.hex-a-gone-cell-valid locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/animation:\s*hexValidPulse 2s ease-in-out infinite/s);
  });
});
