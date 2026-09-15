/**
 * Wave 67 leftover after tip/#316 — Calla pitPulse drop-shadow pair exacts.
 * Wave66 locked keyframe name; lock 0%/50% rgba glow leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit pulse dropshadow pair', () => {
  it('callaPitPulse uses 0%/50% green drop-shadow pair', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 0 4px rgba(72, 187, 120, 0.3))');
    expect(css).toContain('drop-shadow(0 0 10px rgba(72, 187, 120, 0.6))');
  });
});
