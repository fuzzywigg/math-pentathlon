/**
 * Wave 67 leftover after tip/#324 — Sum main-layout gap 2rem chrome.
 * Soft media column existed; lock gap 2rem leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style main-layout gap 2rem', () => {
  it('pins sd-main-layout gap 2rem leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-main-layout\s*\{[\s\S]*?gap:\s*2rem/);
  });
});
