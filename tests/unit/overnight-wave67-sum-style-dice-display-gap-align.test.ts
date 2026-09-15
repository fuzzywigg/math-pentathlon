/**
 * Wave 67 leftover after tip/#324 — Sum dice-display gap/align chrome.
 * Soft die 50px / sum color existed; lock display chrome leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style dice-display gap align', () => {
  it('pins sd-dice-display flex + gap 1rem + align center leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-dice-display\s*\{[\s\S]*?display:\s*flex/);
    expect(css).toMatch(
      /\.sd-dice-display\s*\{[\s\S]*?align-items:\s*center/
    );
    expect(css).toMatch(/\.sd-dice-display\s*\{[\s\S]*?gap:\s*1rem/);
  });
});
