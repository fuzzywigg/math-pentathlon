/**
 * Wave 65 leftover after tip/#313 — Hex .hex-board drop-shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style board drop-shadow', () => {
  it('hex-board drop-shadow 0 4px 12px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-board\s*\{[^}]*filter:\s*drop-shadow\(0 4px 12px rgba\(0, 0, 0, 0\.15\)\)/s);
  });
});
