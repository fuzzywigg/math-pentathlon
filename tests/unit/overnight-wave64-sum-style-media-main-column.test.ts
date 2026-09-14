/**
 * Wave 64 leftover after tip/#303 — Sum media main-layout column.
 * Soft main gap/align existed; lock 768px column leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 sum — style media main column', () => {
  it('pins @media 768px sd-main-layout column leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/@media \(max-width: 768px\)/);
    expect(css).toMatch(
      /@media \(max-width: 768px\)\s*\{[\s\S]*?\.sd-main-layout\s*\{[\s\S]*?flex-direction:\s*column/
    );
  });
});
