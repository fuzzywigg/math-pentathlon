/**
 * Wave 68 leftover after tip/#333 — store-rect filter 3/6.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style store rect filter 3 6', () => {
  it('store-rect drops 3px/6px shadow filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3))');
    expect(css).toMatch(/\.calla-store-rect\s*\{[^}]*filter:\s*drop-shadow\(0 3px 6px rgba\(0, 0, 0, 0\.3\)\)/s);
  });
});
