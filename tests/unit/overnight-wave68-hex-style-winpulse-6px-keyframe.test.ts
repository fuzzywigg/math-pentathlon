/**
 * Wave 68 leftover after tip/#334 — Hex style @keyframes hexWinPulse drop-shadow(0 0 6px rgba(255, 215, 0, 0.6)). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style winpulse-6px-keyframe', () => {
  it('@keyframes hexWinPulse locks drop-shadow(0 0 6px rgba(255, 215, 0, 0.6)) exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@keyframes hexWinPulse');
    expect(css).toMatch(/@keyframes hexWinPulse[\s\S]*drop-shadow\(0 0 6px rgba\(255, 215, 0, 0\.6\)\)/s);
  });
});
