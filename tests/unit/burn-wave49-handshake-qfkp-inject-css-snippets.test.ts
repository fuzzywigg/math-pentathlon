/**
 * Wave 49 — Handshake four inject CSS snippet leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

describe('Wave 49 handshake — css snippets', () => {
  beforeEach(() => {
    for (const id of ['qg-styles', 'fiar-styles', 'kwa-styles', 'par55-styles']) {
      document.getElementById(id)?.remove();
    }
  });
  it('each inject declares its board container class', () => {
    injectQGStyles();
    injectFiarStyles();
    injectKwaStyles();
    injectPar55Styles();
    expect(document.getElementById('qg-styles')!.textContent).toMatch(/\.qg-board-container/);
    expect(document.getElementById('fiar-styles')!.textContent).toMatch(/\.fiar-board-container/);
    expect(document.getElementById('kwa-styles')!.textContent).toMatch(/\.kwa-board/);
    expect(document.getElementById('par55-styles')!.textContent).toMatch(/\.par55/);
  });
});
