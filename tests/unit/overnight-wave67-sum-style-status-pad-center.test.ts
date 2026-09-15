/**
 * Wave 67 leftover after tip/#316 — Sum status pad/center chrome.
 * Soft fontsize/weight existed; lock text-align center + pad 1rem. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style status pad center', () => {
  it('pins sd-status text-align center + padding 1rem leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-status\s*\{[\s\S]*?text-align:\s*center/
    );
    expect(css).toMatch(/\.sd-status\s*\{[\s\S]*?padding:\s*1rem/);
  });
});
