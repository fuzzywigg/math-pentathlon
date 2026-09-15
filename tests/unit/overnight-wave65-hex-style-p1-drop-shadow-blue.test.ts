/**
 * Wave 65 leftover after tip/#313 — Hex cell-p1 blue drop-shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style p1 drop-shadow blue', () => {
  it('drop-shadow blue rgba(33,150,243,0.4)', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 2px 4px rgba(33, 150, 243, 0.4))');
  });
});
