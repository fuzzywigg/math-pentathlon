/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-edge fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style edge-fill-none', () => {
  it('.hex-edge locks fill: none exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-edge');
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*fill:\s*none/s);
  });
});
