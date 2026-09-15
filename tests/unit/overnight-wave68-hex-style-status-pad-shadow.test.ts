/**
 * Wave 68 leftover after tip/#336 — Hex status padding + box-shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style status pad shadow', () => {
  it('hex-status padding 12px 20px + box-shadow 0.08', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-status\s*\{[^}]*padding:\s*12px 20px/s);
    expect(css).toContain('box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)');
  });
});
