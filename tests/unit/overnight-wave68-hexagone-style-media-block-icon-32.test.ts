/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style media-block-icon-32. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style media-block-icon-32', () => {
  it('@media block-icon locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/@media \(max-width: 480px\)[\s\S]*?\.block-icon\s*\{[^}]*width:\s*32px/s);
  });
});
