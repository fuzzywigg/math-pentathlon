/**
 * Wave 66 leftover after tip/#316 — Contig media game-area pad chrome.
 * Soft status seats existed; lock @media 600px padding 0.5rem. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 contig — style media game-area pad', () => {
  it('pins @media 600px contig-game-area padding 0.5rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /@media \(max-width: 600px\)[\s\S]*?\.contig-game-area\s*\{[\s\S]*?padding:\s*0\.5rem/
    );
  });
});
