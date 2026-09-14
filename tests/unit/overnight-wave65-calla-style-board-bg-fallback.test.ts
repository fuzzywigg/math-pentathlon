/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla board-bg fallback fill.
 * Soft gradient url elsewhere; lock #7a4015 fallback. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style board-bg fallback fill', () => {
  it('pins .calla-board-bg fallback fill #7a4015', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-board-bg\s*\{[^}]*fill:\s*#7a4015/);
  });
});
