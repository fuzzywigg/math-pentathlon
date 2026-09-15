/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone .block-name capitalize. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style block-name capitalize', () => {
  it('block-name text-transform capitalize', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.block-name\s*\{[^}]*text-transform:\s*capitalize/s);
  });
});
