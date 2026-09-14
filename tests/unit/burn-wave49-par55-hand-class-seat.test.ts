/**
 * Wave 49 — Par55 hand container seat class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — hand seat class', () => {
  it('sets par55-hand-playerN class', () => {
    const s = createInitialState();
    expect(renderHand(s, 'player1', () => undefined).className).toContain('par55-hand-player1');
    expect(renderHand(s, 'player2', () => undefined).className).toContain('par55-hand-player2');
  });
});
