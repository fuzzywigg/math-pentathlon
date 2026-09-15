/**
 * Wave 68 leftover after tip/#333 — arrow filter drop-shadow.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style arrow filter drop shadow', () => {
  it('arrow drops 1px/2px shadow filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-arrow\s*\{[^}]*filter:\s*drop-shadow\(0 1px 2px rgba\(0, 0, 0, 0\.2\)\)/s);
  });
});
