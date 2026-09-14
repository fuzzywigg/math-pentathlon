/**
 * Wave 64 leftover after tip/#303 — Hex win/place animation bindings. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hex — style win place animation', () => {
  it('animation hexWinPulse + hexCellPlace bindings', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('animation: hexWinPulse 1s ease-in-out infinite');
    expect(css).toContain('animation: hexCellPlace 0.3s ease-out');
    expect(css).toContain('stroke: #8b7355');
  });
});
