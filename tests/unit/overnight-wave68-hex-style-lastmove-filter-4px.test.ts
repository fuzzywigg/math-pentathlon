/**
 * Wave 68 leftover after tip/#336 — Hex last-move filter 4px orange. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style lastmove filter 4px', () => {
  it('hex-cell-last-move filter 4px orange exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('filter: drop-shadow(0 0 4px rgba(255, 152, 0, 0.5))');
  });
});
