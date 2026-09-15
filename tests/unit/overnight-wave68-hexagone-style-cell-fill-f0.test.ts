/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone cell fill #f0f0f0. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style cell fill f0', () => {
  it('hex-a-gone-cell fill f0f0f0 + stroke bbb + filter 0.08', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-cell\s*\{[^}]*fill:\s*#f0f0f0/s);
    expect(css).toMatch(/\.hex-a-gone-cell\s*\{[^}]*stroke:\s*#bbb/s);
    expect(css).toContain('drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))');
  });
});
