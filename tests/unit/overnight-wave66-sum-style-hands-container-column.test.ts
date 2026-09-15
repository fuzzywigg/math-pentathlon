/**
 * Wave 66 leftover after tip/#316 — Sum hands-container column chrome.
 * Soft hand-label seats existed; lock container column/gap leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 sum — style hands-container column', () => {
  it('pins sd-hands-container column gap 1rem leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-hands-container\s*\{[\s\S]*?flex-direction:\s*column/
    );
    expect(css).toMatch(/\.sd-hands-container\s*\{[\s\S]*?gap:\s*1rem/);
  });
});
