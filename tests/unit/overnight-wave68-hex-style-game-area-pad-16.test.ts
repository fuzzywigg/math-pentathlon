/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-game-area padding. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style game-area-pad-16', () => {
  it('.hex-game-area locks padding: 16px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-game-area');
    expect(css).toMatch(/\.hex-game-area\s*\{[^}]*padding:\s*16px/s);
  });
});
