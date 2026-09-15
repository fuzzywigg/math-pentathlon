/**
 * Wave 68 leftover after tip/#336 — Hex label font-size + fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style label size fill', () => {
  it('hex-label font-size 10px + fill #555 + weight 500', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-label\s*\{[^}]*font-size:\s*10px/s);
    expect(css).toMatch(/\.hex-label\s*\{[^}]*fill:\s*#555/s);
    expect(css).toMatch(/\.hex-label\s*\{[^}]*font-weight:\s*500/s);
  });
});
