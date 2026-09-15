/**
 * Wave 67 leftover after tip/#324 — Sum die position relative chrome.
 * Soft 50px white / shadow existed; lock position relative leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style die relative', () => {
  it('pins sd-die position relative leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-die\s*\{[\s\S]*?position:\s*relative/);
  });
});
