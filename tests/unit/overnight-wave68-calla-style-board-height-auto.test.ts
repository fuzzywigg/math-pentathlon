/**
 * Wave 68 leftover after tip/#333 — board height auto.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style board height auto', () => {
  it('board height is auto', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-board\s*\{[^}]*height:\s*auto/s);
  });
});
