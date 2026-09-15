/**
 * Wave 67 leftover after tip/#316 — Sum main-layout gap 2rem chrome.
 * Soft media column existed; lock gap 2rem + flex-start leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style main-layout gap', () => {
  it('pins sd-main-layout gap 2rem + align flex-start leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-main-layout\s*\{[\s\S]*?display:\s*flex/);
    expect(css).toMatch(/\.sd-main-layout\s*\{[\s\S]*?gap:\s*2rem/);
    expect(css).toMatch(
      /\.sd-main-layout\s*\{[\s\S]*?align-items:\s*flex-start/
    );
  });
});
