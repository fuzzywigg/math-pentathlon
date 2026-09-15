/**
 * Wave 67 leftover after tip/#324 — Hex media max-height 80vw. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style media max-height 80vw', () => {
  it('@media hex-board max-height 80vw exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('max-height: 80vw');
    expect(css).toContain('max-width: 95vw');
  });
});
