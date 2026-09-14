/**
 * Wave 64 leftover after tip/#303 — Sum roll/pass focus-visible outline.
 * Soft pad/min-width chrome existed; lock focus outline leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 sum — style focus-visible outline', () => {
  it('pins sd-roll/pass focus-visible outline leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-roll-btn:focus-visible\s*\{[\s\S]*?outline:\s*2px solid var\(--color-primary\)/
    );
    expect(css).toMatch(
      /\.sd-pass-btn:focus-visible\s*\{[\s\S]*?outline-offset:\s*2px/
    );
  });
});
