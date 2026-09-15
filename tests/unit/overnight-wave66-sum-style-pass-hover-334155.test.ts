/**
 * Wave 66 leftover after tip/#316 — Sum pass hover #334155 chrome.
 * Soft pass focus-outline existed; lock hover fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 sum — style pass hover 334155', () => {
  it('pins sd-pass-btn:hover background #334155', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-pass-btn:hover\s*\{[\s\S]*?background-color:\s*#334155/
    );
  });
});
