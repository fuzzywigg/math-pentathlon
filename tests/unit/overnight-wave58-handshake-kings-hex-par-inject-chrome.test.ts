/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — kings/hex/par inject CSS handshake.
 * Distinct from wave57 status/aria handshake. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 58 handshake — kings hex par inject chrome', () => {
  it('mounts residual inject/style chrome across niche', () => {
    injectPar55Styles();
    const parCss = document.getElementById('par55-styles')?.textContent ?? '';
    expect(parCss).toContain('box-shadow: 0 0 0 2px #ff9800');
    expect(parCss).toContain('fill: #c8e6c9 !important');

    renderBoard(createInitialBoard());
    const kingsCss = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(kingsCss).toContain('#daa520');
    expect(kingsCss).toContain('#4169e1');

    const styleCss = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(styleCss).toContain('@keyframes hexWinPulse');
    expect(styleCss).toContain('@keyframes hexValidPulse');
    expect(styleCss).toContain('width: min(350px, 100%)');
  });
});
