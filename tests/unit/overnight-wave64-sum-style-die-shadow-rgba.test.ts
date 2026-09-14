/**
 * Wave 64 leftover after tip/#303 — Sum style.css die shadow rgba.
 * Soft die 50px/border existed; lock box-shadow leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 sum — style die shadow rgba', () => {
  it('pins sd-die box-shadow rgba(0, 0, 0, 0.2) leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-die\s*\{[\s\S]*?box-shadow:\s*0 4px 8px rgba\(0, 0, 0, 0\.2\)/
    );
  });
});
