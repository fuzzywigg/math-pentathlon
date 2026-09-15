/**
 * Wave 68 leftover after tip/#337 — Sum hand-label player2 color.
 * Soft player1 color existed; lock player2 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style hand-label player2', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-hand-label\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
  });
});
