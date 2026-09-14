/**
 * Wave 63 leftover after #301 — Hex board max-height 500px residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hex — style board max-height', () => {
  it('pins .hex-board max-height 500px leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-board');
    expect(css).toContain('max-height: 500px');
  });
});
