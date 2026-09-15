/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style media-wrapper-pad. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style media-wrapper-pad', () => {
  it('@media hex-a-gone wrapper locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]*?\.hex-a-gone-wrapper\s*\{[^}]*padding:\s*0\.75rem 0/s);
  });
});
