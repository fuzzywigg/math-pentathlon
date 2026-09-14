/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone bank-title chrome exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hexagone — style bank title chrome', () => {
  it('bank-title color #2d3748 + letter-spacing', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-bank-title');
    expect(css).toContain('color: #2d3748');
    expect(css).toContain('letter-spacing: -0.01em');
  });
});
