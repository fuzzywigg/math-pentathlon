/**
 * Wave 66 leftover after tip/#316 — Sum controls gap 12px chrome.
 * Soft dice-area / main-layout existed; lock controls gap leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 sum — style controls gap 12', () => {
  it('pins sd-controls gap 12px + margin-top 8px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-controls\s*\{[\s\S]*?gap:\s*12px/);
    expect(css).toMatch(/\.sd-controls\s*\{[\s\S]*?margin-top:\s*8px/);
    expect(css).toMatch(
      /\.sd-controls\s*\{[\s\S]*?justify-content:\s*center/
    );
  });
});
