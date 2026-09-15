/**
 * Wave 68 leftover after tip/#333 — store-rect gradient url.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style store gradient url', () => {
  it('store-rect fills url calla-store-gradient', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('url(#calla-store-gradient)');
    expect(css).toMatch(/\.calla-store-rect\s*\{[^}]*fill:\s*url\(#calla-store-gradient\)/s);
  });
});
