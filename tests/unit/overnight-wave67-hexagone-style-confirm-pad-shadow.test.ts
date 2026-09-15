/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone confirm pad + base shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style confirm pad shadow', () => {
  it('confirm-btn pad 0.6rem 1.75rem + base shadow 0.3', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-confirm-btn\s*\{[^}]*padding:\s*0\.6rem 1\.75rem/s);
    expect(css).toContain('box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3)');
  });
});
