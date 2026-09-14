/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla last-move style chrome.
 * Soft render text elsewhere; lock #c05621 / #ed8936 pad leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style last-move chrome', () => {
  it('pins .calla-last-move color #c05621 border #ed8936 pad', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*color:\s*#c05621/);
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*border:\s*2px solid #ed8936/);
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*padding:\s*0\.6rem 1\.25rem/);
  });
});
