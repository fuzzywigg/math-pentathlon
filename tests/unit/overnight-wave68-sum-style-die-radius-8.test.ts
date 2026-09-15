/**
 * Wave 68 leftover after tip/#337 — Sum die border-radius 8px.
 * Soft 50px/white existed; lock radius leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style die radius 8', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-die\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
