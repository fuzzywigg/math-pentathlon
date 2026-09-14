/**
 * Wave 63 Contig/SD residual after tip #301 — Sum die/pip style chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 sum — style die pip chrome', () => {
  it('pins die 50px and pip 8px leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-die\s*\{[\s\S]*?width:\s*50px/);
    expect(css).toMatch(/\.sd-die\s*\{[\s\S]*?height:\s*50px/);
    expect(css).toMatch(/\.sd-die\s*\{[\s\S]*?border:\s*2px solid #333/);
    expect(css).toMatch(/\.sd-die-pip\s*\{[\s\S]*?width:\s*8px/);
    expect(css).toMatch(/\.sd-die-pip\s*\{[\s\S]*?height:\s*8px/);
  });
});
