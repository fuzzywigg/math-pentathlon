/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone placingPulse 1.5s. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style placing pulse 1.5s', () => {
  it('placing animation placingPulse 1.5s exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('animation: placingPulse 1.5s ease-in-out infinite');
  });
});
