/**
 * Wave 67 leftover after tip/#324 — Hex edge-p1 stroke + opacity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style edge-p1 stroke opacity', () => {
  it('hex-edge-p1 stroke #42a5f5 + opacity 0.7', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-edge-p1\s*\{[^}]*stroke:\s*#42a5f5/s);
    expect(css).toMatch(/\.hex-edge-p1\s*\{[^}]*opacity:\s*0\.7/s);
  });
});
