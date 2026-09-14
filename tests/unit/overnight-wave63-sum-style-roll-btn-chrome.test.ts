/**
 * Wave 63 Contig/SD residual after tip #301 — Sum roll-btn style chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 sum — style roll-btn chrome', () => {
  it('pins primary pad/min-width leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-roll-btn\s*\{[\s\S]*?padding:\s*10px 20px/);
    expect(css).toMatch(/\.sd-roll-btn\s*\{[\s\S]*?min-width:\s*120px/);
    expect(css).toMatch(/\.sd-roll-btn\s*\{[\s\S]*?background-color:\s*var\(--color-primary\)/);
    expect(css).toMatch(/\.sd-roll-btn\s*\{[\s\S]*?border-radius:\s*6px/);
  });
});
