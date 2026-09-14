/**
 * Wave 63 leftover after #301 — Hex-a-Gone coverage #4a5568 residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hexagone — style coverage color', () => {
  it('pins .hex-a-gone-coverage color #4a5568 leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-coverage');
    expect(css).toContain('color: #4a5568');
  });
});
