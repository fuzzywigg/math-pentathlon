/**
 * Wave 68 leftover after tip/#337 — Sum pass focus-visible primary outline.
 * Soft outline-offset 2px existed; lock outline color leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style pass focus outline primary', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-pass-btn:focus-visible\s*\{[\s\S]*?outline:\s*2px solid var\(--color-primary\)/
    );
  });
});
