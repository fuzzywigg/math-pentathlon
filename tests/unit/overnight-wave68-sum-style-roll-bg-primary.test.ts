/**
 * Wave 68 leftover after tip/#337 — Sum roll background primary.
 * Soft hover primary-dark existed; lock base primary leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style roll bg primary', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-roll-btn\s*\{[\s\S]*?background-color:\s*var\(--color-primary\)/
    );
  });
});
