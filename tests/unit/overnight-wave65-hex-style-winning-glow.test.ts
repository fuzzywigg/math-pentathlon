/**
 * Wave 65 leftover after tip/#313 — Hex winning gold glow drop-shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style winning glow', () => {
  it('winning drop-shadow gold 0.8', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))');
  });
});
