/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone placing ring 0.2. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style placing ring', () => {
  it('placing ring rgba(237,137,54,0.2)', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('0 0 0 3px rgba(237, 137, 54, 0.2)');
  });
});
