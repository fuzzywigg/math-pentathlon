/**
 * Wave 65 leftover after tip/#313 — Hex .hex-edge-p1 opacity 0.7. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style edge-p1 opacity', () => {
  it('hex-edge-p1 opacity 0.7', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-edge-p1 {');
    expect(css).toMatch(/\.hex-edge-p1\s*\{[^}]*opacity:\s*0\.7/s);
  });
});
