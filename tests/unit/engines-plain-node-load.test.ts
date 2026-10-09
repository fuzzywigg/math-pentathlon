/**
 * burn-1008-mp-module-boundaries — prove every game rules engine loads in a
 * plain Node context (Vitest environment: 'node', no jsdom).
 *
 * Engines must not require document/window at module-evaluation time.
 */
import { describe, it, expect } from 'vitest';

const ENGINE_MODULES = [
  '../../src/games/calla/rules',
  '../../src/games/contig-60/rules',
  '../../src/games/fab-a-diffy/rules',
  '../../src/games/fiar/rules',
  '../../src/games/frac-fact/rules',
  '../../src/games/fraction-pinball/rules',
  '../../src/games/hex/rules',
  '../../src/games/hex-a-gone/rules',
  '../../src/games/juggle/rules',
  '../../src/games/kings-quadraphages/rules',
  '../../src/games/kwatro-sinko/rules',
  '../../src/games/par-55/rules',
  '../../src/games/pent-em-in/rules',
  '../../src/games/prime-gold/rules',
  '../../src/games/queens-guards/rules',
  '../../src/games/ramrod/rules',
  '../../src/games/remainder-islands/rules',
  '../../src/games/star-track/rules',
  '../../src/games/stars-bars/rules',
  '../../src/games/sum-dominoes/rules',
] as const;

describe('engines load in plain Node (no jsdom)', () => {
  it('runs without document / window globals', () => {
    expect(typeof document).toBe('undefined');
    expect(typeof window).toBe('undefined');
  });

  it('imports all 20 rules engines and exposes at least one function', async () => {
    expect(ENGINE_MODULES).toHaveLength(20);

    for (const spec of ENGINE_MODULES) {
      const mod = (await import(spec)) as Record<string, unknown>;
      const fnCount = Object.values(mod).filter(
        (v) => typeof v === 'function'
      ).length;
      expect(fnCount, `${spec} should export ≥1 function`).toBeGreaterThan(0);
    }

    // Still no DOM after engine evaluation.
    expect(typeof document).toBe('undefined');
    expect(typeof window).toBe('undefined');
  });
});
