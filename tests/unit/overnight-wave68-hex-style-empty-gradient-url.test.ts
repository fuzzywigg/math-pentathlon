/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style empty-gradient-url', () => {
  it('.hex-cell locks fill: url(#hex-empty-gradient) exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell');
    expect(css).toMatch(/fill:\s*url\(#hex-empty-gradient\)/s);
  });
});
