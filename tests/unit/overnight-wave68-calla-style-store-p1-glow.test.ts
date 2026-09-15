/**
 * Wave 68 leftover after tip/#333 — store-p1 active glow.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style store p1 glow', () => {
  it('P1 active store glows blue 8px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 0 8px rgba(66, 165, 245, 0.4))');
    expect(css).toMatch(/\.calla-store-p1\.calla-store-active \.calla-store-rect\s*\{[^}]*filter:\s*drop-shadow\(0 0 8px rgba\(66, 165, 245, 0\.4\)\)/s);
  });
});
