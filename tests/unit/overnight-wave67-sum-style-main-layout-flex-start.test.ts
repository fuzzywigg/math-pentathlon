/**
 * Wave 67 leftover after tip/#324 — Sum main-layout align flex-start.
 * Soft media column existed; lock align-items flex-start leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style main-layout flex-start', () => {
  it('pins sd-main-layout align-items flex-start leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-main-layout\s*\{[\s\S]*?align-items:\s*flex-start/
    );
  });
});
