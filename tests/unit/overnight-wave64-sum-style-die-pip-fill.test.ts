/**
 * Wave 64 leftover after tip/#303 — Sum style die-pip fill/transform.
 * Soft pip 8px size existed; lock #111 + 50% + translate. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 sum — style die pip fill', () => {
  it('pins sd-die-pip #111 radius 50% translate leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-die-pip\s*\{[\s\S]*?background:\s*#111/);
    expect(css).toMatch(/\.sd-die-pip\s*\{[\s\S]*?border-radius:\s*50%/);
    expect(css).toMatch(
      /\.sd-die-pip\s*\{[\s\S]*?transform:\s*translate\(-50%, -50%\)/
    );
  });
});
