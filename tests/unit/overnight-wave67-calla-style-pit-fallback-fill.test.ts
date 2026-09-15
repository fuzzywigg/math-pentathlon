/**
 * Wave 67 leftover after tip/#323/#324 — pit-circle fallback fill.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit fallback fill', () => {
  it('pit-circle fallback fills #4a2c16', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('fill: #4a2c16');
  });
});
