/**
 * Wave 66 leftover after tip/#316 — Calla status panel gradient chrome.
 * Soft status mount existed; lock gradient/radius leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style status gradient', () => {
  it('status uses white→#f8f9fa gradient and 12px radius', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)');
    expect(css).toMatch(/\.calla-status\s*\{[^}]*border-radius:\s*12px/s);
    expect(css).toMatch(/\.calla-status\s*\{[^}]*padding:\s*1\.25rem/s);
  });
});
