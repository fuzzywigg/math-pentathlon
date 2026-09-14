/**
 * Wave 63 Contig/SD residual after tip #301 — Sum controls + media layout. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 sum — style controls media', () => {
  it('pins controls gap and 768px column leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-controls\s*\{[\s\S]*?gap:\s*12px/);
    expect(css).toMatch(/\.sd-controls\s*\{[\s\S]*?margin-top:\s*8px/);
    expect(css).toMatch(
      /@media \(max-width:\s*768px\)[\s\S]*?\.sd-main-layout\s*\{[\s\S]*?flex-direction:\s*column/
    );
  });
});
