/**
 * Wave 66 leftover after tip/#316 — Hex edge-p1/p2 opacity exact.
 * Soft edge stroke-width; lock seat stroke + opacity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hex — style edge seat opacity', () => {
  it('edge-p1/p2 stroke seats + opacity 0.7 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-edge-p1\s*\{[^}]*stroke:\s*#42a5f5/s);
    expect(css).toMatch(/\.hex-edge-p1\s*\{[^}]*opacity:\s*0\.7/s);
    expect(css).toMatch(/\.hex-edge-p2\s*\{[^}]*stroke:\s*#ef5350/s);
    expect(css).toMatch(/\.hex-edge-p2\s*\{[^}]*opacity:\s*0\.7/s);
  });
});
