/**
 * Wave 67 leftover after tip/#324 — Hex label Inter font-family. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style label Inter font', () => {
  it("hex-label font-family Inter stack exact", () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-label\s*\{[^}]*font-family:\s*'Inter', system-ui, sans-serif/s);
  });
});
