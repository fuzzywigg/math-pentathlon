/**
 * Wave 66 leftover after tip/#316 — Hex hexWinPulse 50% glow exact.
 * Soft animation name; lock 50% drop-shadow leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hex — style winpulse 50 glow', () => {
  it('hexWinPulse 50% drop-shadow 12px gold exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@keyframes hexWinPulse');
    expect(css).toContain('drop-shadow(0 0 12px rgba(255, 215, 0, 1))');
    expect(css).toContain('drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))');
  });
});
