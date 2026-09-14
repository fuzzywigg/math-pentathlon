/**
 * Wave 48 — Handshake inject styles across four engines. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 48 handshake — inject four', () => {
  beforeEach(() => {
    for (const id of ['juggle-styles', 'ramrod-styles', 'remainder-islands-styles', 'fraction-pinball-styles']) {
      document.getElementById(id)?.remove();
    }
  });
  it('each style id present once', () => {
    injectJuggleStyles();
    injectRamrodStyles();
    injectRemainderIslandsStyles();
    injectFractionPinballStyles();
    injectJuggleStyles();
    expect(document.getElementById('juggle-styles')).toBeTruthy();
    expect(document.getElementById('ramrod-styles')).toBeTruthy();
    expect(document.getElementById('remainder-islands-styles')).toBeTruthy();
    expect(document.getElementById('fraction-pinball-styles')).toBeTruthy();
  });
});
