/**
 * Wave 68 leftover after tip/#337 — Contig roll border-radius 6px.
 * Soft shadow-sm existed; lock radius leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style roll radius 6', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-roll-btn\s*\{[\s\S]*?border-radius:\s*6px/);
  });
});
