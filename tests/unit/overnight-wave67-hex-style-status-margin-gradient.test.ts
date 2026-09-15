/**
 * Wave 67 leftover after tip/#324 — Hex status margin + gradient. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style status margin gradient', () => {
  it('hex-status margin-bottom 16px + gradient end stop', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-status\s*\{[^}]*margin-bottom:\s*16px/s);
    expect(css).toContain('rgba(248, 250, 252, 0.9)');
  });
});
