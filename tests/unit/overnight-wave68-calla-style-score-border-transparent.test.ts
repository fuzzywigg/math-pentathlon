/**
 * Wave 68 leftover after tip/#333 — score border transparent.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style score border transparent', () => {
  it('score defaults to 2px solid transparent border', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-score\s*\{[^}]*border:\s*2px solid transparent/s);
  });
});
