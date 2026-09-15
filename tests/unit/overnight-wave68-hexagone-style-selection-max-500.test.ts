/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style selection-max-500. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style selection-max-500', () => {
  it('.hex-a-gone-selection-area locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-selection-area\s*\{[^}]*max-width:\s*500px/s);
  });
});
