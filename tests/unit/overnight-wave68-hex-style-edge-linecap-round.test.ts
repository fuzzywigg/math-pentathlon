/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-edge stroke-linecap. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style edge-linecap-round', () => {
  it('.hex-edge locks stroke-linecap: round exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-edge');
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*stroke-linecap:\s*round/s);
  });
});
