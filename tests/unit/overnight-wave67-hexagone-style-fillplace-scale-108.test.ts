/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone hexFillPlace scale 1.08. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style fillplace scale 1.08', () => {
  it('hexFillPlace 50% scale(1.08) exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@keyframes hexFillPlace');
    expect(css).toContain('transform: scale(1.08)');
  });
});
