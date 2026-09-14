/**
 * Wave 63 Contig/SD residual after tip #301 — Sum dice-sum + status chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 sum — style dice-sum status', () => {
  it('pins dice-sum size and status weight leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-dice-sum\s*\{[\s\S]*?font-size:\s*1\.5rem/);
    expect(css).toMatch(/\.sd-dice-sum\s*\{[\s\S]*?font-weight:\s*bold/);
    expect(css).toMatch(/\.sd-status\s*\{[\s\S]*?font-size:\s*1\.2rem/);
    expect(css).toMatch(/\.sd-status\s*\{[\s\S]*?font-weight:\s*500/);
  });
});
