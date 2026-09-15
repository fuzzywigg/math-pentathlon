/**
 * Wave 68 leftover after tip/#337 — Sum status player1 color.
 * Soft player2 existed; lock player1 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style status player1', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-status\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1\)/
    );
  });
});
