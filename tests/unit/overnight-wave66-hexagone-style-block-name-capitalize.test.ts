/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone .block-name capitalize exact.
 * Soft bank blocks; lock capitalize leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hexagone — style block name capitalize', () => {
  it('block-name text-transform capitalize + #4a5568 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.block-name {');
    expect(css).toMatch(/\.block-name\s*\{[^}]*text-transform:\s*capitalize/s);
    expect(css).toMatch(/\.block-name\s*\{[^}]*color:\s*#4a5568/s);
  });
});
