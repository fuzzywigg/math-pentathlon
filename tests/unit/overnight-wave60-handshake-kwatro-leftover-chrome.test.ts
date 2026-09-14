/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro inject × mount handshake.
 * Distinct from kings/hex/par handshake drafts; kwatro-only residual chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  injectKwaStyles,
  renderChipInfo,
} from '../../src/games/kwatro-sinko/board-ui';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 handshake — kwatro leftover chrome', () => {
  it('inject gradient/glow + shell target/pass-ready + tutorial titles', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('#d4c4a8');
    expect(css).toContain('@keyframes kwa-glow');
    expect(css).toContain('fill: #a5d6a7 !important');

    const info = renderChipInfo(createInitialState());
    expect(info.querySelector('.kwa-player-info.player1')?.textContent).toContain(
      'Blue (Even):'
    );

    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    expect(root.querySelector('.kwa-target-info')?.textContent).toContain(
      'Create an alignment where:'
    );
    expect(root.querySelector('.kwa-board')).toBeTruthy();
    expect(root.querySelector('.kwa-status')?.classList.contains('player1')).toBe(
      true
    );

    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules')?.title
    ).toBe('Movement Rules');
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'complete')?.title
    ).toBe('Ready to Play!');
  });
});
