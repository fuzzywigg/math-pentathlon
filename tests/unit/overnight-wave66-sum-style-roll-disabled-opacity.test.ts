/**
 * Wave 66 leftover after tip/#316 — Sum roll disabled opacity chrome.
 * Soft roll hover/focus existed; lock disabled opacity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 sum — style roll disabled opacity', () => {
  it('pins sd-roll-btn:disabled opacity 0.5 + not-allowed', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-roll-btn:disabled\s*\{[\s\S]*?opacity:\s*0\.5/
    );
    expect(css).toMatch(
      /\.sd-roll-btn:disabled\s*\{[\s\S]*?cursor:\s*not-allowed/
    );
  });
});
