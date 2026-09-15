/**
 * Wave 66 leftover after tip/#316 — Calla wrapper gap/pad chrome.
 * Soft mount existed; lock gap 1.25rem + pad 1.5rem leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style wrapper gap pad', () => {
  it('wrapper uses column flex gap 1.25rem and pad 1.5rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*flex-direction:\s*column/s);
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*gap:\s*1\.25rem/s);
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*padding:\s*1\.5rem/s);
  });
});
