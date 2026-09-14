/**
 * Wave 64 leftover after tip/#303 — Hex .hex-label font-size 10px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hex — style label fontsize', () => {
  it('hex-label font-size 10px + fill #555', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-label {');
    expect(css).toMatch(/\.hex-label\s*\{[^}]*font-size:\s*10px/s);
    expect(css).toMatch(/\.hex-label\s*\{[^}]*fill:\s*#555/s);
  });
});
