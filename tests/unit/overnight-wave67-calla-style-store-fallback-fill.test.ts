/**
 * Wave 67 leftover after tip/#323/#324 — store-rect fallback fill.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style store fallback fill', () => {
  it('store-rect fallback fills #3a2515', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('fill: #3a2515');
  });
});
