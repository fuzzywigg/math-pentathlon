/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla status box-shadow chrome.
 * Soft status mount elsewhere; lock dual box-shadow leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style status shadow', () => {
  it('pins .calla-status dual box-shadow + gradient leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-status\s*\{[^}]*padding:\s*1\.25rem/);
    expect(css).toContain('linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)');
    expect(css).toContain('0 4px 12px rgba(0, 0, 0, 0.08)');
    expect(css).toContain('0 1px 3px rgba(0, 0, 0, 0.05)');
  });
});
