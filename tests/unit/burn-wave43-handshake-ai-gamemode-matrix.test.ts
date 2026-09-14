/**
 * Wave 43 — Handshake isAITurn gameMode matrix across leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as juggle } from '../../src/games/juggle/rules';
import { createInitialState as hag } from '../../src/games/hex-a-gone/types';
import { createInitialState as calla } from '../../src/games/calla/types';
import { createInitialState as ramrod } from '../../src/games/ramrod/rules';
import { createInitialState as sum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as contig } from '../../src/games/contig-60/types';
import { isAITurn as jAI } from '../../src/games/juggle/ai';
import { isAITurn as hAI } from '../../src/games/hex-a-gone/ai';
import { isAITurn as cAI } from '../../src/games/calla/ai';
import { isAITurn as rAI } from '../../src/games/ramrod/ai';
import { isAITurn as sAI } from '../../src/games/sum-dominoes/ai';
import { isAITurn as gAI } from '../../src/games/contig-60/ai';

describe('Wave 43 handshake — AI gameMode matrix', () => {
  it('sum ignores gameMode; others require human-vs-ai', () => {
    expect(jAI(juggle(), 'player1', 'human-vs-human')).toBe(false);
    expect(hAI(hag(), 'player1', 'human-vs-human')).toBe(false);
    expect(cAI(calla(), 'player1', 'human-vs-human')).toBe(false);
    expect(rAI(ramrod(), 'player1', 'human-vs-human')).toBe(false);
    expect(gAI(contig(), 'player1', 'human-vs-human')).toBe(false);
    // sum has no gameMode arg — true whenever seat matches
    expect(sAI(sum(), 'player1')).toBe(true);
  });
});
