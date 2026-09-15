/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style selected-shape-30. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style selected-shape-30', () => {
  it('.selected-shape locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.selected-shape\s*\{[^}]*width:\s*30px/s);
  });
});
