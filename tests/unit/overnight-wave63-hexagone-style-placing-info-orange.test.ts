/**
 * Wave 63 leftover after #301 — Hex-a-Gone placing-info #ed8936 + pulse residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hexagone — style placing-info orange', () => {
  it('pins placing-info #ed8936 + placingInfoPulse leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-placing-info');
    expect(css).toContain('border: 2px solid #ed8936');
    expect(css).toContain('@keyframes placingInfoPulse');
  });
});
