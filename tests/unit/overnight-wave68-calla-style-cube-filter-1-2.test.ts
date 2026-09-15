/**
 * Wave 68 leftover after tip/#333 — cube filter 1/2.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style cube filter 1 2', () => {
  it('cube drops 1px/2px shadow filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-cube\s*\{[^}]*filter:\s*drop-shadow\(0 1px 2px rgba\(0, 0, 0, 0\.3\)\)/s);
  });
});
