/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone board aspect-ratio exact.
 * Soft bank title; lock aspect-ratio 1 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hexagone — style board aspect', () => {
  it('hex-a-gone-board aspect-ratio 1 + min 350 width exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-board\s*\{[^}]*aspect-ratio:\s*1/s);
    expect(css).toMatch(/\.hex-a-gone-board\s*\{[^}]*width:\s*min\(350px, 100%\)/s);
  });
});
