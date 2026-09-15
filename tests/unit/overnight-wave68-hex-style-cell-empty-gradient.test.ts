/**
 * Wave 68 leftover after tip/#336 — Hex cell empty gradient url. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style cell empty gradient', () => {
  it('hex-cell fill url hex-empty-gradient + stroke 8b7355', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('fill: url(#hex-empty-gradient)');
    expect(css).toContain('stroke: #8b7355');
  });
});
