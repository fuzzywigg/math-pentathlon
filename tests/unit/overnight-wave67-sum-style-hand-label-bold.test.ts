/**
 * Wave 67 leftover after tip/#324 — Sum hand-label font-weight bold.
 * Soft seat colors existed; lock bold leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style hand-label bold', () => {
  it('pins sd-hand-label font-weight bold leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-hand-label\s*\{[\s\S]*?font-weight:\s*bold/
    );
  });
});
