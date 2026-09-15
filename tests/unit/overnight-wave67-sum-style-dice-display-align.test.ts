/**
 * Wave 67 leftover after tip/#316 — Sum dice-display align chrome.
 * Soft die 50px / status fontsize existed; lock display align gap. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style dice-display align', () => {
  it('pins sd-dice-display flex align center + gap 1rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-dice-display\s*\{[\s\S]*?display:\s*flex/);
    expect(css).toMatch(
      /\.sd-dice-display\s*\{[\s\S]*?align-items:\s*center/
    );
    expect(css).toMatch(/\.sd-dice-display\s*\{[\s\S]*?gap:\s*1rem/);
  });
});
