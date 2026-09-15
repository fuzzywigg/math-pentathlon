/**
 * Wave 67 leftover after tip/#323/#324 — score-p2 active shadow/border.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style score-p2 shadow border', () => {
  it('active P2 score shadow and border-color', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('0 4px 12px rgba(211, 47, 47, 0.25)');
    expect(css).toMatch(/\.calla-score-p2\.active\s*\{[^}]*border-color:\s*rgba\(239, 83, 80, 0\.4\)/s);
  });
});
