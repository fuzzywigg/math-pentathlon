/**
 * Wave 67 leftover after tip/#316 — Calla wrapper display/align chrome.
 * Wave66 locked gap/pad; lock display flex + align-items leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style wrapper display align', () => {
  it('wrapper uses display flex and align-items center', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*display:\s*flex/s);
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*align-items:\s*center/s);
  });
});
