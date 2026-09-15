/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style player-indicator-pad. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style player-indicator-pad', () => {
  it('.player-indicator locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-players \.player-indicator\s*\{[^}]*padding:\s*0\.6rem 1\.25rem/s);
  });
});
