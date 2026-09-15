/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-status box-shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style status-shadow-exact', () => {
  it('.hex-status locks box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-status');
    expect(css).toMatch(/\.hex-status\s*\{[^}]*box-shadow:\s*0 2px 8px rgba\(0, 0, 0, 0\.08\)/s);
  });
});
