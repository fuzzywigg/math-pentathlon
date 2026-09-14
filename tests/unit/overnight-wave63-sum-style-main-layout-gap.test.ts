/**
 * Wave 63 Contig/SD residual after tip #301 — Sum main-layout gap chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 sum — style main-layout gap', () => {
  it('pins .sd-main-layout gap/align leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-main-layout\s*\{[\s\S]*?gap:\s*2rem/);
    expect(css).toMatch(/\.sd-main-layout\s*\{[\s\S]*?align-items:\s*flex-start/);
  });
});
