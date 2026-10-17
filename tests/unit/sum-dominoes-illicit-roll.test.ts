/**
 * q-mp-1467: illicit human-roll skip must use post-wait roll latch.
 * Hermetic stubbed seat/after sequences + harness wiring (no Playwright).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  countIllicitHumanRollSkips,
  isIllicitHumanRollSkip,
} from '../../scripts/lib/sum-dominoes-illicit-roll.mjs';

const HARNESS = resolve(
  process.cwd(),
  'scripts/sum-dominoes-deep-playtest.mjs'
);
const LIB = resolve(process.cwd(), 'scripts/lib/sum-dominoes-illicit-roll.mjs');

describe('isIllicitHumanRollSkip (q-mp-1467)', () => {
  it('flags seat roll → dice without roll (illicit auto-roll)', () => {
    expect(
      isIllicitHumanRollSkip({ roll: true }, { dice: true, roll: false })
    ).toBe(true);
  });

  it('rejects when post-wait seat had no roll affordance (pre-wait bug case)', () => {
    // Loop entry during AI think: pre-wait before.roll === false undercounts.
    expect(
      isIllicitHumanRollSkip({ roll: false }, { dice: true, roll: false })
    ).toBe(false);
  });

  it('rejects normal roll→place path and empty snapshots', () => {
    expect(
      isIllicitHumanRollSkip({ roll: true }, { dice: true, roll: true })
    ).toBe(false);
    expect(
      isIllicitHumanRollSkip({ roll: true }, { dice: false, roll: false })
    ).toBe(false);
    expect(isIllicitHumanRollSkip(null, { dice: true, roll: false })).toBe(
      false
    );
    expect(isIllicitHumanRollSkip({ roll: true }, null)).toBe(false);
  });

  it('counts illicit skips over stubbed before/after sequences', () => {
    // Realistic AI-handoff: pre-wait false, post-wait true, then illicit dice.
    const preWaitUndercount = countIllicitHumanRollSkips([
      {
        seat: { roll: false },
        after: { dice: true, roll: false },
      },
    ]);
    expect(preWaitUndercount).toBe(0);

    const postWaitLatch = countIllicitHumanRollSkips([
      {
        seat: { roll: true },
        after: { dice: true, roll: false },
      },
      {
        seat: { roll: false },
        after: { dice: false, roll: true },
      },
      {
        seat: { roll: true },
        after: { dice: true, roll: false },
      },
    ]);
    expect(postWaitLatch).toBe(2);
  });
});

describe('sum-dominoes-deep-playtest harness wiring (q-mp-1467)', () => {
  it('imports illicit helper and does not compare pre-wait before.roll', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/sum-dominoes-illicit-roll\.mjs['"]/);
    expect(src).toMatch(/isIllicitHumanRollSkip/);
    // Must not reintroduce pre-wait before.roll illicit gate.
    expect(src).not.toMatch(/before\.roll\s*&&\s*after\.dice/);
    // Post-wait (or wait canRoll) latch feeds the illicit comparison.
    expect(src).toMatch(/waitForHumanOrEnd/);
    expect(src).toMatch(/isIllicitHumanRollSkip\(\s*seat\s*,\s*after\s*\)/);
  });

  it('keeps the pure illicit helper in scripts/lib', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/export function isIllicitHumanRollSkip/);
    expect(libSrc).toMatch(/export function countIllicitHumanRollSkips/);
  });
});
