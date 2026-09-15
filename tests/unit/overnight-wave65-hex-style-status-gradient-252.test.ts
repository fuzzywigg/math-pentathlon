/**
 * Wave 65 leftover after tip/#313 — Hex .hex-status gradient 252. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style status gradient 252', () => {
  it('hex-status rgba(248,250,252,0.9)', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('rgba(248, 250, 252, 0.9)');
  });
});
