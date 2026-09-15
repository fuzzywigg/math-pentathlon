/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style placingpulse-5px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style placingpulse-5px', () => {
  it('@keyframes placingPulse locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/@keyframes placingPulse[\s\S]*0 0 0 5px rgba\(237, 137, 54, 0\.3\)/s);
  });
});
