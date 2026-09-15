/**
 * Wave 68 leftover after tip/#337 — Sum pass border-radius 6px.
 * Soft neutral-600 existed; lock radius leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style pass radius 6', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-pass-btn\s*\{[\s\S]*?border-radius:\s*6px/);
  });
});
