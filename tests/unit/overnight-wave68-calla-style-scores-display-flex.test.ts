/**
 * Wave 68 leftover after tip/#333 — scores display flex.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style scores display flex', () => {
  it('scores row is display flex', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-scores\s*\{[^}]*display:\s*flex/s);
  });
});
