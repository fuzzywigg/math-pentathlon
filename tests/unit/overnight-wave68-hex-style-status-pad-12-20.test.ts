/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-status padding. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style status-pad-12-20', () => {
  it('.hex-status locks padding: 12px 20px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-status');
    expect(css).toMatch(/\.hex-status\s*\{[^}]*padding:\s*12px 20px/s);
  });
});
