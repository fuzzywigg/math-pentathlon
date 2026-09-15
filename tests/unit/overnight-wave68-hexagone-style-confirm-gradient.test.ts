/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone confirm gradient exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style confirm gradient', () => {
  it('confirm-btn green gradient 48bb78→38a169→2f855a', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain(
      'background: linear-gradient(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%)'
    );
  });
});
