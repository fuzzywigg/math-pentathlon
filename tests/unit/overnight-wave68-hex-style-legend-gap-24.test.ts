/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-legend gap. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style legend-gap-24', () => {
  it('.hex-legend locks gap: 24px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-legend');
    expect(css).toMatch(/\.hex-legend\s*\{[^}]*gap:\s*24px/s);
  });
});
