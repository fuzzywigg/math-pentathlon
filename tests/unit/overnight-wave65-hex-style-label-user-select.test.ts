/**
 * Wave 65 leftover after tip/#313 — Hex .hex-label user-select none. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style label user-select', () => {
  it('hex-label user-select none', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-label\s*\{[^}]*user-select:\s*none/s);
  });
});
