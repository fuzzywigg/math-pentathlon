/**
 * Wave 67 leftover after tip/#316 — Calla board width/height chrome.
 * Wave66 locked max-width 550; lock width 100% + height auto leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style board width height', () => {
  it('board uses width 100% and height auto', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-board\s*\{[^}]*width:\s*100%/s);
    expect(css).toMatch(/\.calla-board\s*\{[^}]*height:\s*auto/s);
  });
});
