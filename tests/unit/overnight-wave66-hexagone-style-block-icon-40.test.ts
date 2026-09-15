/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone .block-icon 40px exact.
 * Soft block-btn border; lock icon size leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hexagone — style block icon 40', () => {
  it('block-icon width/height 40px + radius 6 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.block-icon {');
    expect(css).toMatch(/\.block-icon\s*\{[^}]*width:\s*40px/s);
    expect(css).toMatch(/\.block-icon\s*\{[^}]*height:\s*40px/s);
    expect(css).toMatch(/\.block-icon\s*\{[^}]*border-radius:\s*6px/s);
  });
});
