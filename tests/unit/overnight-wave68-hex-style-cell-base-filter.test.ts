/**
 * Wave 68 leftover after tip/#336 — Hex cell base drop-shadow filter. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style cell base filter', () => {
  it('hex-cell base filter 1px 2px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))');
  });
});
