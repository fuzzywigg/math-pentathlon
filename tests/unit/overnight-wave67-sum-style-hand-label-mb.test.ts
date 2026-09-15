/**
 * Wave 67 leftover after tip/#324 — Sum hand-label margin-bottom chrome.
 * Soft seat colors existed; lock margin-bottom 0.5rem leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style hand-label mb', () => {
  it('pins sd-hand-label margin-bottom 0.5rem leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-hand-label\s*\{[\s\S]*?margin-bottom:\s*0\.5rem/
    );
  });
});
