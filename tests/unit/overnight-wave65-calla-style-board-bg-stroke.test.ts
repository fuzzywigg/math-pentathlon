/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla board-bg stroke chrome.
 * Soft fill/url elsewhere; lock stroke #4a2c0f / width 5. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style board-bg stroke', () => {
  it('pins .calla-board-bg stroke #4a2c0f stroke-width 5', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-board-bg\s*\{[^}]*stroke:\s*#4a2c0f/);
    expect(css).toMatch(/\.calla-board-bg\s*\{[^}]*stroke-width:\s*5/);
  });
});
