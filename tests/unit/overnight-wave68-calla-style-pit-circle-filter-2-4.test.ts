/**
 * Wave 68 leftover after tip/#333 — pit-circle filter 2/4.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style pit circle filter 2 4', () => {
  it('pit-circle drops 2px/4px shadow filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-circle\s*\{[^}]*filter:\s*drop-shadow\(0 2px 4px rgba\(0, 0, 0, 0\.3\)\)/s);
  });
});
