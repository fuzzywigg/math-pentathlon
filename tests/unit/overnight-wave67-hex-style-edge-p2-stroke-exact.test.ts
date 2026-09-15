/**
 * Wave 67 leftover after tip/#324 — Hex edge-p2 stroke exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style edge-p2 stroke', () => {
  it('hex-edge-p2 stroke #ef5350 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-edge-p2\s*\{[^}]*stroke:\s*#ef5350/s);
    expect(css).toMatch(/\.hex-edge-p2\s*\{[^}]*opacity:\s*0\.7/s);
  });
});
