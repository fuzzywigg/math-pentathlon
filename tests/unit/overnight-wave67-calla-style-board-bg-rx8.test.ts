/**
 * Wave 67 leftover after tip/#323/#324 — board-bg rx 8.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style board-bg rx8', () => {
  it('board-bg uses rx 8', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-board-bg\s*\{[^}]*rx:\s*8/s);
  });
});
