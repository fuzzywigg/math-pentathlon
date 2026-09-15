/**
 * Wave 67 leftover after tip/#323/#324 — callaPitPulse keyframe filters.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pulse keyframe filters', () => {
  it('pulse keyframes use 4px/10px green drop-shadows', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 0 4px rgba(72, 187, 120, 0.3))');
    expect(css).toContain('drop-shadow(0 0 10px rgba(72, 187, 120, 0.6))');
  });
});
