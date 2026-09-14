/**
 * Wave 63 leftover after #301 — Hex-a-Gone confirm btn gradient colors. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hexagone — style confirm gradient', () => {
  it('pins confirm btn #48bb78 / #38a169 / #2f855a leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-confirm-btn');
    expect(css).toContain('#48bb78');
    expect(css).toContain('#38a169');
    expect(css).toContain('#2f855a');
  });
});
