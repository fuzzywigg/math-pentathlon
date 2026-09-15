/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style cell-drop-shadow-1px', () => {
  it('.hex-cell locks drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell');
    expect(css).toMatch(/drop-shadow\(0 1px 2px rgba\(0, 0, 0, 0\.1\)\)/s);
  });
});
