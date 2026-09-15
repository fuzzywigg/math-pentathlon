/**
 * Wave 67 leftover after tip/#324 — Sum die-pip 8px dims chrome.
 * Soft #111 / 50% / translate existed; lock width/height 8px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style die-pip 8px', () => {
  it('pins sd-die-pip width/height 8px leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-die-pip\s*\{[\s\S]*?width:\s*8px/);
    expect(css).toMatch(/\.sd-die-pip\s*\{[\s\S]*?height:\s*8px/);
  });
});
