/**
 * Wave 43 — Handshake juggle×hexagone isAITurn. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { isAITurn as juggleAI } from '../../src/games/juggle/ai';
import { createInitialState as hexInit } from '../../src/games/hex-a-gone/types';
import { isAITurn as hexAI } from '../../src/games/hex-a-gone/ai';

describe('Wave 43 handshake — juggle×hexagone AI turn', () => {
  it('both engines agree human-vs-ai seat gates', () => {
    expect(juggleAI(juggleInit(), 'player1', 'human-vs-ai')).toBe(true);
    expect(hexAI(hexInit(), 'player1', 'human-vs-ai')).toBe(true);
    expect(juggleAI(juggleInit(), 'player2', 'human-vs-ai')).toBe(false);
    expect(hexAI(hexInit(), 'player2', 'human-vs-ai')).toBe(false);
  });
});
