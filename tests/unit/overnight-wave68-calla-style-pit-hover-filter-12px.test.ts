/**
 * Wave 68 leftover after tip/#333 — valid-pit hover filter 12px.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style pit hover filter 12px', () => {
  it('valid hover drops green 12px glow filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-valid:hover \.calla-pit-circle\s*\{[^}]*filter:\s*drop-shadow\(0 0 12px rgba\(72, 187, 120, 0\.7\)\)/s);
  });
});
