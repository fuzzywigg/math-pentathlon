/**
 * Wave 68 leftover after tip/#337 — Sum dice-sum color #333.
 * Soft 1.5rem/bold existed; lock #333 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style dice-sum color 333', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-dice-sum\s*\{[\s\S]*?color:\s*#333/);
  });
});
