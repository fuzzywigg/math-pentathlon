/**
 * Hex leftover polish after #383/#404 AI-seat locks + 2026-10-07 deep playtest:
 * ≥44px cell targets (flat + pointy) + prefers-reduced-motion for board glow.
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
  it('board-ui hexRadius 26 yields flat≥44 and pointy 52 SVG-unit cells', () => {
    expect(boardUi).toMatch(/hexRadius\s*=\s*26/);
    // Intrinsic width/height attributes prevent 300px replaced-element collapse.
    expect(boardUi).toMatch(/setAttribute\(\s*['"]width['"]/);
    expect(boardUi).toMatch(/setAttribute\(\s*['"]height['"]/);
  });

  it('pins Hex board width so cells stay ≥44 CSS px on all pointers', () => {
    const hexCss = hexStyleSection();
    expect(hexCss).toContain('.hex-game-area');
    expect(hexCss).toContain('overflow-x: auto');
    expect(hexCss).toContain('min-width: 801px');
    expect(hexCss).toContain('width: 801px');
    expect(hexCss).toContain('.hex-board');
    expect(hexCss).toContain('@media (pointer: coarse)');
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
