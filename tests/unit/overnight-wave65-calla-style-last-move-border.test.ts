/**
 * Wave 65 leftover after tip/#315 — Calla last-move CSS border #ed8936.
 * Panel existence soft (wave50/52); lock style.css border leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style last-move border', () => {
  it('pins calla-last-move border 2px solid #ed8936', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-last-move\s*\{[\s\S]*?border:\s*2px solid #ed8936/
    );
  });
});
