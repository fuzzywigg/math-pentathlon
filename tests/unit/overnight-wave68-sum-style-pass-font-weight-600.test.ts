/**
 * Wave 68 leftover after tip/#337 — Sum pass font-weight 600.
 * Soft radius/pad existed; lock font-weight leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style pass font-weight 600', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-pass-btn\s*\{[\s\S]*?font-weight:\s*600/);
  });
});
