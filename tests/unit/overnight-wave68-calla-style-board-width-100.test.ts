/**
 * Wave 68 leftover after tip/#333 — board width 100%.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style board width 100', () => {
  it('board width is 100%', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-board\s*\{[^}]*width:\s*100%/s);
  });
});
