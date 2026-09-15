/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone cell drop-shadow 0.08. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style cell drop-shadow 08', () => {
  it('cell drop-shadow rgba 0.08', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))');
  });
});
