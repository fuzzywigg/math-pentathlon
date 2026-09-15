/**
 * Wave 65 leftover after tip/#313 — Hex empty fill url(#hex-empty-gradient). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style empty gradient url', () => {
  it('fill url(#hex-empty-gradient)', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('fill: url(#hex-empty-gradient)');
  });
});
