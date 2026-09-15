/**
 * Wave 67 leftover after tip/#316 — Sum pass neutral-600 chrome.
 * Soft pass hover #334155 existed; lock neutral-600 base fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style pass neutral 600', () => {
  it('pins sd-pass-btn color-neutral-600 leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-pass-btn\s*\{[\s\S]*?background-color:\s*var\(--color-neutral-600\)/
    );
    expect(css).toMatch(/\.sd-pass-btn\s*\{[\s\S]*?min-width:\s*120px/);
  });
});
