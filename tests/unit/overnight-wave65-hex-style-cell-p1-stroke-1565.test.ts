/**
 * Wave 65 leftover after tip/#313 — Hex .hex-cell-p1 stroke #1565c0. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style cell-p1 stroke 1565', () => {
  it('hex-cell-p1 stroke #1565c0', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-cell-p1\s*\{[^}]*stroke:\s*#1565c0/s);
  });
});
