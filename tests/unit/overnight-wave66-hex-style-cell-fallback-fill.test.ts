/**
 * Wave 66 leftover after tip/#316 — Hex cell fallback fill #f5f5dc exact.
 * Soft stroke #8b7355; lock empty-gradient + fallback leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hex — style cell fallback fill', () => {
  it('hex-cell empty-gradient url + fallback #f5f5dc exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('fill: url(#hex-empty-gradient)');
    expect(css).toContain('fill: #f5f5dc');
  });
});
