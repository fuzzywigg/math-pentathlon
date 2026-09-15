/**
 * Wave 68 leftover after tip/#333 — store-rect transition fast.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style store transition fast', () => {
  it('store-rect transitions stroke/stroke-width/filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-store-rect\s*\{[^}]*transition:/s);
    expect(css).toContain('stroke-width var(--transition-fast)');
  });
});
