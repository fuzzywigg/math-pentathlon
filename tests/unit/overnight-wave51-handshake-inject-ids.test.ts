/**
 * Wave 51 leftover after #233 — Handshake inject style ids. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 51 handshake — inject ids', () => {
  it('injects distinct style ids idempotently', () => {
    for (const id of ['par55-styles', 'kwa-styles', 'sd-styles']) {
      document.getElementById(id)?.remove();
    }
    injectPar55Styles();
    injectKwaStyles();
    injectSDStyles();
    injectPar55Styles();
    injectKwaStyles();
    injectSDStyles();
    expect(document.querySelectorAll('#par55-styles').length).toBe(1);
    expect(document.querySelectorAll('#kwa-styles').length).toBe(1);
    expect(document.querySelectorAll('#sd-styles').length).toBe(1);
  });
});
