/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone board min 350px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style board min 350', () => {
  it('hex-a-gone-board width min 350px + drop-shadow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-board\s*\{[^}]*width:\s*min\(350px, 100%\)/s);
    expect(css).toContain('filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))');
  });
});
