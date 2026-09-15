/**
 * Wave 68 leftover after tip/#333 — pit-last filter 6px.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style pit last filter 6px', () => {
  it('last-sown pit drops orange 6px glow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 0 6px rgba(237, 137, 54, 0.5))');
    expect(css).toMatch(/\.calla-pit-last \.calla-pit-circle\s*\{[^}]*filter:\s*drop-shadow\(0 0 6px rgba\(237, 137, 54, 0\.5\)\)/s);
  });
});
