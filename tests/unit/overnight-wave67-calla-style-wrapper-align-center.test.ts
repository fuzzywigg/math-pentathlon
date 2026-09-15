/**
 * Wave 67 leftover after tip/#323/#324 — wrapper align-items center.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style wrapper align center', () => {
  it('wrapper centers with align-items center', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*align-items:\s*center/s);
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*display:\s*flex/s);
  });
});
