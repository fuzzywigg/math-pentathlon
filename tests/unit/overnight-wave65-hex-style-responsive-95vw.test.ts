/**
 * Wave 65 leftover after tip/#313 — Hex responsive max-width 95vw. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style responsive 95vw', () => {
  it('max-width 95vw under 600px media', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('max-width: 95vw');
  });
});
