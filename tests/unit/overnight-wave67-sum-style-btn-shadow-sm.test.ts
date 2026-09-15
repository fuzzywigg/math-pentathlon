/**
 * Wave 67 leftover after tip/#324 — Sum roll/pass shadow-sm chrome.
 * Soft primary/neutral fills existed; lock shadow-sm leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style btn shadow-sm', () => {
  it('pins sd roll/pass box-shadow shadow-sm leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-roll-btn\s*\{[\s\S]*?box-shadow:\s*var\(--shadow-sm\)/
    );
    expect(css).toMatch(
      /\.sd-pass-btn\s*\{[\s\S]*?box-shadow:\s*var\(--shadow-sm\)/
    );
  });
});
