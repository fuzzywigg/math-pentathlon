/**
 * Wave 68 leftover after tip/#333 — board-bg gradient url.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style board gradient url', () => {
  it('board-bg fills url calla-board-gradient', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('url(#calla-board-gradient)');
    expect(css).toMatch(/\.calla-board-bg\s*\{[^}]*fill:\s*url\(#calla-board-gradient\)/s);
  });
});
