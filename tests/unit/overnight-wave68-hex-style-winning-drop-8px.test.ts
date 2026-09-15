/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell-winning drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style winning-drop-8px', () => {
  it('.hex-cell-winning locks drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)) exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-winning');
    expect(css).toMatch(/\.hex-cell-winning\s*\{[^}]*drop-shadow\(0 0 8px rgba\(255, 215, 0, 0\.8\)\)/s);
  });
});
