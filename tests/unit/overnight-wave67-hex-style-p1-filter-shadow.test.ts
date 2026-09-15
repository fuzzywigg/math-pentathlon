/**
 * Wave 67 leftover after tip/#324 — Hex p1 cell filter shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style p1 filter shadow', () => {
  it('hex-cell-p1 blue drop-shadow + stroke exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-p1');
    expect(css).toContain('drop-shadow(0 2px 4px rgba(33, 150, 243, 0.4))');
    expect(css).toMatch(/\.hex-cell-p1\s*\{[^}]*stroke:\s*#1565c0/s);
  });
});
