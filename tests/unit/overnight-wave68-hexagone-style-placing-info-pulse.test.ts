/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style placing-info-pulse. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style placing-info-pulse', () => {
  it('.hex-a-gone-placing-info locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/animation:\s*placingInfoPulse 2s ease-in-out infinite/s);
  });
});
