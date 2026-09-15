/**
 * Wave 67 leftover after tip/#323/#324 — last-move orange gradient.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style last-move gradient', () => {
  it('last-move uses orange translucent gradient', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('rgba(237, 137, 54, 0.08)');
    expect(css).toContain('rgba(237, 137, 54, 0.15)');
  });
});
