/**
 * Wave 68 leftover after tip/#333 — store-p2 active glow.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style store p2 glow', () => {
  it('P2 active store glows red 8px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 0 8px rgba(239, 83, 80, 0.4))');
    expect(css).toMatch(/\.calla-store-p2\.calla-store-active \.calla-store-rect\s*\{[^}]*filter:\s*drop-shadow\(0 0 8px rgba\(239, 83, 80, 0\.4\)\)/s);
  });
});
