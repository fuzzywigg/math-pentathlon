/**
 * Wave 68 leftover after tip/#337 — Sum die-pip position absolute.
 * Soft 8px/#111 existed; lock position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style die-pip absolute', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-die-pip\s*\{[\s\S]*?position:\s*absolute/);
  });
});
