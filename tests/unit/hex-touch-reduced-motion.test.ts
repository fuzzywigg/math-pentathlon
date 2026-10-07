/**
 * Hex leftover polish after #383/#404 AI-seat locks:
 * coarse-pointer ≥44px cell targets + prefers-reduced-motion for board glow.
 * (Hex has no invalid-move shake; win pulse / place animations are the motion.)
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { readAppCss } from './_app-css';

const styleCss = readAppCss();
const boardUi = readFileSync(
  join(process.cwd(), 'src/games/hex/board-ui.ts'),
  'utf8'
);

/** Slice from HEX GAME STYLES through STAR TRACK so keepers stay Hex-local. */
function hexStyleSection(): string {
  const start = styleCss.indexOf('HEX GAME STYLES');
  const end = styleCss.indexOf('STAR TRACK GAME STYLES');
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return styleCss.slice(start, end);
}

describe('Hex touch targets + reduced-motion', () => {
  it('board-ui hexRadius 22 yields 44 SVG-unit cell height (44px design intent)', () => {
    expect(boardUi).toMatch(/hexRadius\s*=\s*22/);
  });

  it('coarse-pointer media pins Hex board width so cells stay ≥44 CSS px', () => {
    const hexCss = hexStyleSection();
    expect(hexCss).toContain('@media (pointer: coarse)');
    expect(hexCss).toContain('.hex-game-area');
    expect(hexCss).toContain('overflow-x: auto');
    expect(hexCss).toContain('min-width: 690px');
    expect(hexCss).toContain('.hex-board');
  });

  it('prefers-reduced-motion disables Hex win glow and place animations', () => {
    const hexCss = hexStyleSection();
    expect(hexCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(hexCss).toContain('.hex-cell-winning');
    expect(hexCss).toContain('.hex-cell-p1');
    expect(hexCss).toContain('.hex-cell-p2');
    expect(hexCss).toContain('.hex-cell-empty:hover');
    expect(hexCss).toMatch(/animation:\s*none\s*!important/);
    expect(hexCss).toMatch(
      /\.hex-cell-empty:hover\s*\{[^}]*transform:\s*none/s
    );
  });
});
