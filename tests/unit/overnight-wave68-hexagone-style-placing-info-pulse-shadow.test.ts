/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style placing-info-pulse-shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style placing-info-pulse-shadow', () => {
  it('@keyframes placingInfoPulse locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/@keyframes placingInfoPulse[\s\S]*box-shadow:\s*0 0 12px rgba\(237, 137, 54, 0\.3\)/s);
  });
});
