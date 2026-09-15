/**
 * Wave 67 leftover after tip/#324 — Sum pass pad + min-width chrome.
 * Soft hover/neutral existed; lock 10px 20px + 120px leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style pass pad minwidth', () => {
  it('pins sd-pass-btn padding 10px 20px + min-width 120 leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-pass-btn\s*\{[\s\S]*?padding:\s*10px 20px/);
    expect(css).toMatch(/\.sd-pass-btn\s*\{[\s\S]*?min-width:\s*120px/);
  });
});
