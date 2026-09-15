/**
 * Wave 66 leftover after tip/#316 — Hex board drop-shadow exact.
 * Soft max-height; lock filter drop-shadow leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hex — style board drop shadow', () => {
  it('hex-board max-width 600 + drop-shadow exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-board\s*\{[^}]*max-width:\s*600px/s);
    expect(css).toContain('filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))');
  });
});
