/**
 * Wave 63 leftover after #301 — Hex-a-Gone status players row mount. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 63 hexagone — players row mount', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('status mounts .hex-a-gone-players with two indicators', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el, 'human-vs-human');
    expect(el.querySelectorAll('.hex-a-gone-players')).toHaveLength(1);
    expect(el.querySelectorAll('.hex-a-gone-players .player-indicator')).toHaveLength(
      2
    );
  });
});
