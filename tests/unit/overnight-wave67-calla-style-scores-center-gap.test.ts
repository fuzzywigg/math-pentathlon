/**
 * Wave 67 leftover after tip/#323/#324 — scores center gap 2rem.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style scores center gap', () => {
  it('scores centers with gap 2rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-scores\s*\{[^}]*justify-content:\s*center/s);
    expect(css).toMatch(/\.calla-scores\s*\{[^}]*gap:\s*2rem/s);
  });
});
