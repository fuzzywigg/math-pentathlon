/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-move-count margin-top. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style move-count-margin-8', () => {
  it('.hex-move-count locks margin-top: 8px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-move-count');
    expect(css).toMatch(/\.hex-move-count\s*\{[^}]*margin-top:\s*8px/s);
  });
});
