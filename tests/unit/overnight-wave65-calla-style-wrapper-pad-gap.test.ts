/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla wrapper pad/gap chrome.
 * Soft wrapper class elsewhere; lock 1.25rem gap / 1.5rem pad. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style wrapper pad gap', () => {
  it('pins .calla-wrapper column gap 1.25rem pad 1.5rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*flex-direction:\s*column/);
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*gap:\s*1\.25rem/);
    expect(css).toMatch(/\.calla-wrapper\s*\{[^}]*padding:\s*1\.5rem/);
  });
});
