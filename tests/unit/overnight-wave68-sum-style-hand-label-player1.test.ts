/**
 * Wave 68 leftover after tip/#337 — Sum hand-label player1 color.
 * Soft bold/mb existed; lock player1 color leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style hand-label player1', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-hand-label\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1\)/
    );
  });
});
