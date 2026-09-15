/**
 * Wave 66 leftover after tip/#316 — Hex .hex-move-count chrome exact.
 * Soft status chrome; lock move-count color/size leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hex — style move-count chrome', () => {
  it('hex-move-count font-size 0.9rem + color #666 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-move-count {');
    expect(css).toMatch(/\.hex-move-count\s*\{[^}]*font-size:\s*0\.9rem/s);
    expect(css).toMatch(/\.hex-move-count\s*\{[^}]*color:\s*#666/s);
    expect(css).toMatch(/\.hex-move-count\s*\{[^}]*margin-top:\s*8px/s);
  });
});
