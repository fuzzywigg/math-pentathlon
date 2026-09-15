/**
 * Wave 66 leftover after tip/#316 — Calla cube stroke + gold fallback.
 * Soft cube dots existed; lock #b8860b/#ffd700 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style cube fallback gold', () => {
  it('cube strokes #b8860b and falls back to #ffd700', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('stroke: #b8860b');
    expect(css).toContain('fill: #ffd700');
  });
});
