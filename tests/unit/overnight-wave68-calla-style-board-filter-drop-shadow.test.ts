/**
 * Wave 68 leftover after tip/#333 — board filter drop-shadow scoped.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style board filter drop shadow', () => {
  it('board filter drop-shadow is selector-scoped', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-board\s*\{[^}]*filter:\s*drop-shadow\(0 6px 16px rgba\(0, 0, 0, 0\.2\)\)/s);
  });
});
