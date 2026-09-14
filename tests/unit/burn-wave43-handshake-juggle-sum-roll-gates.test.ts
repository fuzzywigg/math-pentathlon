/**
 * Wave 43 — Handshake juggle×sum doRollDice phase gates. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState as juggle,
  doRollDice as juggleRoll,
} from '../../src/games/juggle/rules';
import {
  createInitialState as sum,
  doRollDice as sumRoll,
} from '../../src/games/sum-dominoes/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 handshake — juggle×sum roll gates', () => {
  it('both roll only from rolling; identity otherwise', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const j = juggle();
    const s = sum();
    expect(juggleRoll(j).phase).toBe('selectingShape');
    expect(['placing', 'passing']).toContain(sumRoll(s).phase);
    const jBad = { ...j, phase: 'placing' as const };
    const sBad = { ...s, phase: 'placing' as const, currentDice: [1, 1] as [number, number] };
    expect(juggleRoll(jBad)).toBe(jBad);
    expect(sumRoll(sBad)).toBe(sBad);
  });
});
