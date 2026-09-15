/**
 * Wave 66 leftover after tip/#316 — Sum status font-size 1.2rem chrome.
 * Soft status seat colors existed; lock fontsize/weight leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 sum — style status fontsize 1.2', () => {
  it('pins sd-status font-size 1.2rem + weight 500', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-status\s*\{[\s\S]*?font-size:\s*1\.2rem/);
    expect(css).toMatch(/\.sd-status\s*\{[\s\S]*?font-weight:\s*500/);
  });
});
