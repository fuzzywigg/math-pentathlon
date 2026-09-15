/**
 * Wave 67 leftover after tip/#324 — Hex board drop-shadow filter. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style board drop-shadow', () => {
  it('hex-board filter drop-shadow exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-board {');
    expect(css).toContain('filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))');
  });
});
