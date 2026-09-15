/**
 * Wave 67 leftover after tip/#324 — Hex p2 cell filter shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style p2 filter shadow', () => {
  it('hex-cell-p2 red drop-shadow exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-p2');
    expect(css).toContain('drop-shadow(0 2px 4px rgba(229, 57, 53, 0.4))');
  });
});
