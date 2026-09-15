/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone active indicator border. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style active border blue', () => {
  it('player-indicator.active border-color blue 0.3', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-players .player-indicator.active');
    expect(css).toContain('border-color: rgba(25, 118, 210, 0.3)');
  });
});
