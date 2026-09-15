/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone responsive min-width 55px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style responsive min 55', () => {
  it('min-width 55px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('min-width: 55px');
  });
});
