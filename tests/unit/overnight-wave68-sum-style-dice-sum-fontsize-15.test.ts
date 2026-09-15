/**
 * Wave 68 leftover after tip/#337 — Sum dice-sum font-size 1.5rem.
 * Soft bold existed; lock font-size leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style dice-sum fontsize 15', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-dice-sum\s*\{[\s\S]*?font-size:\s*1\.5rem/);
  });
});
