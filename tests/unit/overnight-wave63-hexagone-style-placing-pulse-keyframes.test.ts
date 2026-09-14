/**
 * Wave 63 leftover after #301 — Hex-a-Gone placingPulse keyframes residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hexagone — style placingPulse keyframes', () => {
  it('pins placingPulse + block-btn.placing border leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@keyframes placingPulse');
    expect(css).toContain('.hex-a-gone-block-btn.placing');
    expect(css).toContain('border-color: #ed8936');
  });
});
