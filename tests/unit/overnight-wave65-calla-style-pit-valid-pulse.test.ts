/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla pit-valid pulse animation.
 * Soft valid class wiring elsewhere; lock callaPitPulse keyframes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style pit-valid pulse', () => {
  it('pins callaPitPulse 2s + green drop-shadow keyframes', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('animation: callaPitPulse 2s ease-in-out infinite');
    expect(css).toContain('@keyframes callaPitPulse');
    expect(css).toContain('drop-shadow(0 0 4px rgba(72, 187, 120, 0.3))');
    expect(css).toContain('drop-shadow(0 0 10px rgba(72, 187, 120, 0.6))');
  });
});
