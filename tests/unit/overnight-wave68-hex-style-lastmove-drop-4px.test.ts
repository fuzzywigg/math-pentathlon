/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell-last-move drop-shadow(0 0 4px rgba(255, 152, 0, 0.5)). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style lastmove-drop-4px', () => {
  it('.hex-cell-last-move locks drop-shadow(0 0 4px rgba(255, 152, 0, 0.5)) exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-last-move');
    expect(css).toMatch(/\.hex-cell-last-move\s*\{[^}]*drop-shadow\(0 0 4px rgba\(255, 152, 0, 0\.5\)\)/s);
  });
});
