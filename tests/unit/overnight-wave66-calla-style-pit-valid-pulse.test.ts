/**
 * Wave 66 leftover after tip/#316 — Calla valid-pit stroke + pulse keyframes.
 * Soft .calla-pit-valid mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style pit valid pulse', () => {
  it('valid pit uses #48bb78 stroke and callaPitPulse keyframes', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-pit-valid \.calla-pit-circle\s*\{[^}]*stroke:\s*#48bb78/s
    );
    expect(css).toContain('animation: callaPitPulse 2s ease-in-out infinite');
    expect(css).toContain('@keyframes callaPitPulse');
  });
});
