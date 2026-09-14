/**
 * Wave 64 leftover after tip/#303 — Sum dice-sum color #333.
 * Soft 1.5rem/bold existed; lock color leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 sum — style dice-sum color', () => {
  it('pins sd-dice-sum color #333 leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-dice-sum\s*\{[\s\S]*?color:\s*#333/);
  });
});
