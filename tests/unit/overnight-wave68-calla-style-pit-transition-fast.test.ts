/**
 * Wave 68 leftover after tip/#333 — pit-circle transition fast.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style pit transition fast', () => {
  it('pit-circle transitions fill/stroke/transform/filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-circle\s*\{[^}]*transition:/s);
    expect(css).toContain('fill var(--transition-fast)');
    expect(css).toContain('stroke var(--transition-fast)');
  });
});
