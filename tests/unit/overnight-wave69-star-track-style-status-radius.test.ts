/**
 * Wave 69 leftover after tip/#350 — Star Track status radius/pad exact.
 * Soft status role mount existed; lock style.css leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 69 star-track — style status radius', () => {
  it('status pins pad 8px 16px and border-radius 12px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.star-track-status\s*\{[^}]*padding:\s*8px 16px/s
    );
    expect(css).toMatch(
      /\.star-track-status\s*\{[^}]*border-radius:\s*12px/s
    );
  });
});
