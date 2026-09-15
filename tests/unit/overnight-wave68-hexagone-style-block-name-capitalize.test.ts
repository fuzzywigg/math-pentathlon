/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style block-name-capitalize. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style block-name-capitalize', () => {
  it('.block-name locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.block-name\s*\{[^}]*text-transform:\s*capitalize/s);
  });
});
