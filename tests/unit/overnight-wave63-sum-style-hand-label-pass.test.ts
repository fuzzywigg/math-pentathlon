/**
 * Wave 63 Contig/SD residual after tip #301 — Sum hand-label + pass chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 sum — style hand-label pass', () => {
  it('pins hand-label margin and pass neutral leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.sd-hands-container');
    expect(css).toMatch(/\.sd-hand-label\s*\{[\s\S]*?margin-bottom:\s*0\.5rem/);
    expect(css).toMatch(
      /\.sd-pass-btn\s*\{[\s\S]*?background-color:\s*var\(--color-neutral-600\)/
    );
    expect(css).toMatch(/\.sd-pass-btn:hover\s*\{[\s\S]*?#334155/);
  });
});
