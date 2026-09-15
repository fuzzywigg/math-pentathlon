/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone empty block not-allowed. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style empty not-allowed', () => {
  it('block-btn.empty cursor not-allowed', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-block-btn\.empty\s*\{[^}]*cursor:\s*not-allowed/s);
  });
});
