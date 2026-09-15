/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style block-count-065. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style block-count-065', () => {
  it('.block-count locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.block-count\s*\{[^}]*font-size:\s*0\.65rem/s);
  });
});
