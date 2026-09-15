/**
 * Wave 67 leftover after tip/#316 — Sum status seat colors chrome.
 * Soft status fontsize existed; lock player1/2 color vars leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style status seats', () => {
  it('pins sd-status player1/player2 color vars leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-status\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1\)/
    );
    expect(css).toMatch(
      /\.sd-status\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
  });
});
