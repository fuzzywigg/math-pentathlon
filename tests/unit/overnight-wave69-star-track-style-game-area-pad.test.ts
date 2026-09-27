/**
 * Wave 69 leftover after tip/#350 — Star Track game-area pad/gap exact.
 * Soft DOM mounts existed; lock style.css leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 69 star-track — style game-area pad', () => {
  it('game-area pins gap 10px and pad 0.5rem 1rem 1rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.star-track-game-area\s*\{[^}]*gap:\s*10px/s);
    expect(css).toMatch(
      /\.star-track-game-area\s*\{[^}]*padding:\s*0\.5rem 1rem 1rem/s
    );
  });
});
