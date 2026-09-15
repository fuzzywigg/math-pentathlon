/**
 * Wave 67 leftover after tip/#323/#324 — pit-count text-shadow + pointer-events.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit-count shadow pe', () => {
  it('pit-count uses text-shadow and pointer-events none', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-count\s*\{[^}]*text-shadow:\s*2px 2px 4px rgba\(0, 0, 0, 0\.6\)/s);
    expect(css).toMatch(/\.calla-pit-count\s*\{[^}]*pointer-events:\s*none/s);
  });
});
