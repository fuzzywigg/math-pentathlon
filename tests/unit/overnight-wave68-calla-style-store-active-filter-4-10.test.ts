/**
 * Wave 68 leftover after tip/#333 — store-active filter 4/10.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style store active filter 4 10', () => {
  it('active store drops 4px/10px shadow filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35))');
    expect(css).toMatch(/\.calla-store-active \.calla-store-rect\s*\{[^}]*filter:\s*drop-shadow\(0 4px 10px rgba\(0, 0, 0, 0\.35\)\)/s);
  });
});
