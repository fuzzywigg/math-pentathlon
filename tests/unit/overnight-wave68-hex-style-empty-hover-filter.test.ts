/**
 * Wave 68 leftover after tip/#336 — Hex empty hover filter exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style empty hover filter', () => {
  it('hex-cell-empty:hover filter 2px 4px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-cell-empty:hover\s*\{[^}]*filter:\s*drop-shadow\(0 2px 4px rgba\(0, 0, 0, 0\.2\)\)/s);
  });
});
