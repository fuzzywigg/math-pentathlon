/**
 * Wave 69 leftover after tip/#350 — Star Track board width + drop-shadow.
 * Soft viewBox mount existed; lock style.css leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 69 star-track — style board drop-shadow', () => {
  it('board pins min(400px) width and drop-shadow filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.star-track-board\s*\{[^}]*width:\s*min\(400px,\s*100%\)/s
    );
    expect(css).toContain(
      'filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.15))'
    );
  });
});
