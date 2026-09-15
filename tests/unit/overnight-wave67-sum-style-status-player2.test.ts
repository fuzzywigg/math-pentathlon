/**
 * Wave 67 leftover after tip/#324 — Sum status player2 color chrome.
 * Soft status 1.2rem / player1 existed; lock player2 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style status player2', () => {
  it('pins sd-status.player2 color player2 leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-status\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
  });
});
