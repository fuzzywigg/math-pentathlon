/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone confirm idle shadow 0.3. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style confirm idle shadow', () => {
  it('confirm box-shadow rgba 0.3', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3)');
  });
});
