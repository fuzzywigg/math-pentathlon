/**
 * Wave 68 leftover after tip/#337 — Sum controls justify-content center.
 * Soft display flex existed; lock justify leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style controls justify center', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-controls\s*\{[\s\S]*?justify-content:\s*center/
    );
  });
});
