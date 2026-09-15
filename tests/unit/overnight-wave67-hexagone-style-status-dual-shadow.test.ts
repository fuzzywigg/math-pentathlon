/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone status dual shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style status dual shadow', () => {
  it('hex-a-gone-status dual box-shadow includes 0 1px 3px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-status');
    expect(css).toContain('0 1px 3px rgba(0, 0, 0, 0.05)');
  });
});
