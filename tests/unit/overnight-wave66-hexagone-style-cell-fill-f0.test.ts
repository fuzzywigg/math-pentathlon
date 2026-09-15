/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone cell fill #f0f0f0 exact.
 * Soft valid hover; lock empty cell fill/stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hexagone — style cell fill f0', () => {
  it('hex-a-gone-cell fill #f0f0f0 + stroke #bbb exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-cell\s*\{[^}]*fill:\s*#f0f0f0/s);
    expect(css).toMatch(/\.hex-a-gone-cell\s*\{[^}]*stroke:\s*#bbb/s);
  });
});
