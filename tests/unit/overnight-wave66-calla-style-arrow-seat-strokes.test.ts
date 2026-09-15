/**
 * Wave 66 leftover after tip/#316 — Calla arrow P1/P2 stroke colors.
 * Soft arrow mount existed; lock seat stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style arrow seat strokes', () => {
  it('arrow-p1/p2 stroke #42a5f5 / #ef5350', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-arrow-p1\s*\{[^}]*stroke:\s*#42a5f5/s);
    expect(css).toMatch(/\.calla-arrow-p2\s*\{[^}]*stroke:\s*#ef5350/s);
    expect(css).toMatch(/\.calla-arrow\s*\{[^}]*opacity:\s*0\.6/s);
  });
});
