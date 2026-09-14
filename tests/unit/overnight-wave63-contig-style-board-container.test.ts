/**
 * Wave 63 Contig/SD residual after tip #301 — Contig board-container chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 contig — style board-container', () => {
  it('pins .contig-board-container column/center/gap leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.contig-board-container');
    expect(css).toMatch(/\.contig-board-container\s*\{[\s\S]*?flex-direction:\s*column/);
    expect(css).toMatch(/\.contig-board-container\s*\{[\s\S]*?align-items:\s*center/);
    expect(css).toMatch(/\.contig-board-container\s*\{[\s\S]*?gap:\s*1rem/);
  });
});
