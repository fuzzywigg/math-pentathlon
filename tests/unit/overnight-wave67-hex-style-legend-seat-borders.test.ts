/**
 * Wave 67 leftover after tip/#324 — Hex legend p1/p2 border-left. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style legend seat borders', () => {
  it('legend-p1/p2 border-left 3px seat colors', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('border-left: 3px solid #42a5f5');
    expect(css).toContain('border-left: 3px solid #ef5350');
  });
});
