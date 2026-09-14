/**
 * Wave 63 Contig/SD residual after tip #301 — Contig media pad half rem. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 contig — style media pad half', () => {
  it('pins 600px media .contig-game-area padding leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /@media \(max-width:\s*600px\)[\s\S]*?\.contig-game-area\s*\{[\s\S]*?padding:\s*0\.5rem/
    );
  });
});
