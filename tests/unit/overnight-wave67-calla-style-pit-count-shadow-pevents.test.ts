/**
 * Wave 67 leftover after tip/#316 — Calla pit-count shadow + pointer-events.
 * Wave66 locked 18px/#fff; lock text-shadow + pointer-events leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit-count shadow pevents', () => {
  it('pit-count uses text-shadow and pointer-events none', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-pit-count\s*\{[^}]*text-shadow:\s*2px 2px 4px rgba\(0, 0, 0, 0\.6\)/s
    );
    expect(css).toMatch(
      /\.calla-pit-count\s*\{[^}]*pointer-events:\s*none/s
    );
  });
});
