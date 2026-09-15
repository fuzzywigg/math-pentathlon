/**
 * Wave 67 leftover after tip/#316 — Sum media main align-center chrome.
 * Soft media column existed; lock align-items center leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style media align center', () => {
  it('pins @media 768px sd-main-layout align-items center', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /@media \(max-width: 768px\)\s*\{[\s\S]*?\.sd-main-layout\s*\{[\s\S]*?align-items:\s*center/
    );
  });
});
