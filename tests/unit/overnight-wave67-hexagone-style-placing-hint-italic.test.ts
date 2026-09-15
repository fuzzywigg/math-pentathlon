/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone placing-hint italic. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style placing-hint italic', () => {
  it('placing-hint font-style italic exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.placing-hint\s*\{[^}]*font-style:\s*italic/s);
  });
});
