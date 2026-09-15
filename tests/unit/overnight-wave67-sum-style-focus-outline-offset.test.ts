/**
 * Wave 67 leftover after tip/#316 — Sum focus outline-offset chrome.
 * Soft roll disabled / pass hover existed; lock focus-visible offset. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style focus outline offset', () => {
  it('pins sd roll/pass focus-visible outline-offset 2px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-roll-btn:focus-visible\s*\{[\s\S]*?outline-offset:\s*2px/
    );
    expect(css).toMatch(
      /\.sd-pass-btn:focus-visible\s*\{[\s\S]*?outline-offset:\s*2px/
    );
  });
});
