/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style cell-fallback-f5f5dc', () => {
  it('.hex-cell locks fill: #f5f5dc exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell');
    expect(css).toMatch(/fill:\s*#f5f5dc/s);
  });
});
