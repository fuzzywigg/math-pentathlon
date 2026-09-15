/**
 * Wave 67 leftover after tip/#324 — Hex hexWinPulse 12px peak. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style winpulse 12px', () => {
  it('hexWinPulse 50% peak drop-shadow 12px gold', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@keyframes hexWinPulse');
    expect(css).toContain('drop-shadow(0 0 12px rgba(255, 215, 0, 1))');
  });
});
