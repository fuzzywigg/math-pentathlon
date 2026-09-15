/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style placing-hint-085. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style placing-hint-085', () => {
  it('.placing-hint locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.placing-hint\s*\{[^}]*font-size:\s*0\.85rem/s);
  });
});
