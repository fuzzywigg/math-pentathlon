/**
 * Wave 67 leftover after tip/#323/#324 — status shadow + border.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style status shadow border', () => {
  it('status uses soft shadow and 1px border', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('0 4px 12px rgba(0, 0, 0, 0.08)');
    expect(css).toMatch(/\.calla-status\s*\{[^}]*border:\s*1px solid rgba\(0, 0, 0, 0\.05\)/s);
  });
});
