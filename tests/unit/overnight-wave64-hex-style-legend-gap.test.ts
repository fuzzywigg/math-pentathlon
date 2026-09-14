/**
 * Wave 64 leftover after tip/#303 — Hex .hex-legend gap 24px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hex — style legend gap', () => {
  it('hex-legend gap 24px + justify center', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-legend {');
    expect(css).toMatch(/\.hex-legend\s*\{[^}]*gap:\s*24px/s);
    expect(css).toMatch(/\.hex-legend\s*\{[^}]*justify-content:\s*center/s);
  });
});
