/**
 * Wave 69 leftover after tip/#350 — Star Track goal pulse keyframes.
 * Soft goal circle mount existed; lock animation leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 69 star-track — style goal pulse', () => {
  it('goal pins starGoalPulse 3s and @keyframes block', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.star-track-goal\s*\{[^}]*animation:\s*starGoalPulse 3s ease-in-out infinite/s
    );
    expect(css).toContain('@keyframes starGoalPulse');
    expect(css).toContain(
      'filter: drop-shadow(0 0 18px rgba(255, 215, 0, 0.9))'
    );
  });
});
