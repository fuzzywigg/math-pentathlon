/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone media btn min-width 55. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style media btn 55px', () => {
  it('@media block-btn min-width 55px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('min-width: 55px');
  });
});
