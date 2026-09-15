/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-label fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style label-fill-555', () => {
  it('.hex-label locks fill: #555 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-label');
    expect(css).toMatch(/\.hex-label\s*\{[^}]*fill:\s*#555/s);
  });
});
