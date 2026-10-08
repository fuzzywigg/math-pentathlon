/**
 * Touch targets + reduced-motion polish for Hex-a-Gone / Queens / Kings.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { readAppCss } from './_app-css';
import {
  initGame as initKings,
  newGameVsHuman as kingsVsHuman,
  destroyGame as destroyKings,
} from '../../src/games/kings-quadraphages/game-controller';

const styleCss = readAppCss();

afterEach(() => {
  destroyKings();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Hex / Queens / Kings touch + reduced-motion CSS', () => {
  it('Hex-a-Gone bank and confirm buttons declare min-height 44px', () => {
    expect(styleCss).toMatch(
      /\.hex-a-gone-block-btn\s*\{[^}]*min-height:\s*44px/s
    );
    expect(styleCss).toMatch(
      /\.hex-a-gone-confirm-btn\s*\{[^}]*min-height:\s*44px/s
    );
    expect(styleCss).toMatch(
      /@media\s*\(pointer:\s*coarse\)\s*\{[^}]*\.hex-a-gone-block-btn/s
    );
  });

  it('reduced-motion disables Hex-a-Gone + Kings pulse / trap / thinking animations', () => {
    expect(styleCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(styleCss).toContain('.hex-a-gone-cell-valid');
    expect(styleCss).toContain('.hex-a-gone-block-btn.placing');
    expect(styleCss).toContain('.hex-a-gone-placing-info');
    expect(styleCss).toContain('.cell-trapped');
    expect(styleCss).toContain('.cell-invalid');
    expect(styleCss).toContain('.status-ai-thinking::after');
    expect(styleCss).toContain('.qg-winner-banner');
  });

  it('Kings skips invalid shake under prefers-reduced-motion', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);

    const matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    });
    vi.stubGlobal('matchMedia', matchMedia);

    initKings(board, status);
    kingsVsHuman();

    // Select P1 king, then click an illegal destination → would shake.
    const king = board.querySelector('.cell-king') as HTMLElement | null;
    expect(king).toBeTruthy();
    king!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const illegal = board.querySelector(
      '.cell:not(.cell-valid-move):not(.cell-king):not(.cell-selected)'
    ) as HTMLElement | null;
    expect(illegal).toBeTruthy();
    illegal!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(matchMedia).toHaveBeenCalledWith(
      '(prefers-reduced-motion: reduce)'
    );
    expect(board.querySelector('.cell-invalid')).toBeNull();
  });
});
