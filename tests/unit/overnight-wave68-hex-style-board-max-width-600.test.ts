/**
 * Wave 68 leftover after tip/#336 — Hex board max-width 600px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style board max-width 600', () => {
  it('hex-board max-width 600px + max-height 500px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-board\s*\{[^}]*max-width:\s*600px/s);
    expect(css).toMatch(/\.hex-board\s*\{[^}]*max-height:\s*500px/s);
  });
});
