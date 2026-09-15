/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone placing-info pad. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style placing-info pad', () => {
  it('placing-info padding 0.85rem 1.25rem exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-placing-info\s*\{[^}]*padding:\s*0\.85rem 1\.25rem/s);
  });
});
