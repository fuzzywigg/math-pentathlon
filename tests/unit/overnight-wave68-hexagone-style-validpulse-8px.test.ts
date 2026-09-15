/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style validpulse-8px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style validpulse-8px', () => {
  it('@keyframes hexValidPulse locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/@keyframes hexValidPulse[\s\S]*drop-shadow\(0 0 8px rgba\(76, 175, 80, 0\.6\)\)/s);
  });
});
