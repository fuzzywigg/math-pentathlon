/**
 * Wave 67 leftover after tip/#316 — Sum hand-label bold chrome.
 * Soft hands-container column existed; lock label bold + seat colors. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style hand-label bold', () => {
  it('pins sd-hand-label bold + seat color vars leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-hand-label\s*\{[\s\S]*?font-weight:\s*bold/
    );
    expect(css).toMatch(
      /\.sd-hand-label\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1\)/
    );
    expect(css).toMatch(
      /\.sd-hand-label\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
  });
});
