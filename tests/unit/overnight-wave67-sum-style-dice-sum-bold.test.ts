/**
 * Wave 67 leftover after tip/#324 — Sum dice-sum bold chrome.
 * Soft color #333 / 1.5rem existed; lock font-weight bold leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style dice-sum bold', () => {
  it('pins sd-dice-sum font-weight bold leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-dice-sum\s*\{[\s\S]*?font-weight:\s*bold/
    );
  });
});
