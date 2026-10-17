/**
 * q-mp-1468: illicitPassSkip must sample Blue select after waitForHumanOrEnd.
 * Pure helpers + harness wiring (unit-shared; no Playwright).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  BLUE_SELECT_STATUS_RE,
  isBlueSelectStatus,
  isComputerOrThinkingStatus,
  isIllicitPassSkip,
} from '../../scripts/lib/ramrod-illicit-pass.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/ramrod-deep-playtest.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/ramrod-illicit-pass.mjs');

describe('isBlueSelectStatus / isIllicitPassSkip (q-mp-1468)', () => {
  it('matches Blue select copy and rejects AI / place / end statuses', () => {
    expect(isBlueSelectStatus("Blue's turn - Select a rod")).toBe(true);
    expect(isBlueSelectStatus("Blue's turn - Place a rod")).toBe(false);
    expect(isBlueSelectStatus('Computer is thinking...')).toBe(false);
    expect(isBlueSelectStatus('Red wins!')).toBe(false);
    expect(isBlueSelectStatus('')).toBe(false);
    expect(isBlueSelectStatus(null)).toBe(false);
    expect(BLUE_SELECT_STATUS_RE.test("Blue's turn - Select a rod")).toBe(true);
  });

  it('detects illicit pass only when post-wait Blue select flips to computer', () => {
    // Pre-wait AI think would have blueSelect=false → undercount (the bug).
    expect(
      isIllicitPassSkip({
        blueSelectAfterWait: false,
        afterStatus: 'Computer is thinking...',
        afterSelectable: 0,
      })
    ).toBe(false);

    // After wait establishes Blue select, then computer steals the turn.
    expect(
      isIllicitPassSkip({
        blueSelectAfterWait: true,
        afterStatus: 'Computer is thinking...',
        afterSelectable: 0,
      })
    ).toBe(true);

    expect(
      isIllicitPassSkip({
        blueSelectAfterWait: true,
        afterStatus: 'Red is thinking',
        afterSelectable: 0,
      })
    ).toBe(true);

    // Still Blue's turn / still selectable → not illicit.
    expect(
      isIllicitPassSkip({
        blueSelectAfterWait: true,
        afterStatus: "Blue's turn - Select a rod",
        afterSelectable: 0,
      })
    ).toBe(false);
    expect(
      isIllicitPassSkip({
        blueSelectAfterWait: true,
        afterStatus: 'Computer is thinking...',
        afterSelectable: 3,
      })
    ).toBe(false);
  });

  it('computer/thinking matcher stays case-insensitive', () => {
    expect(isComputerOrThinkingStatus('COMPUTER move')).toBe(true);
    expect(isComputerOrThinkingStatus('Thinking…')).toBe(true);
    expect(isComputerOrThinkingStatus("Blue's turn - Select a rod")).toBe(
      false
    );
  });
});

describe('ramrod-deep-playtest harness wiring (q-mp-1468)', () => {
  it('samples blueSelectAfterWait from gate after waitForHumanOrEnd', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/ramrod-illicit-pass\.mjs['"]/);
    expect(src).toMatch(/isBlueSelectStatus/);
    expect(src).toMatch(/isIllicitPassSkip/);
    expect(src).toMatch(/blueSelectAfterWait/);

    const waitIdx = src.indexOf(
      'await waitForHumanOrEnd(page, Date.now() + STALL_MS)'
    );
    const sampleIdx = src.indexOf(
      'const blueSelectAfterWait = isBlueSelectStatus(gate.status)'
    );
    const illicitIdx = src.indexOf('isIllicitPassSkip({');
    expect(waitIdx).toBeGreaterThan(-1);
    expect(sampleIdx).toBeGreaterThan(waitIdx);
    expect(illicitIdx).toBeGreaterThan(sampleIdx);

    // Must not reintroduce pre-wait beforePlayer evaluate + blueSelect field.
    expect(src).not.toMatch(/\bbeforePlayer\b/);
    expect(src).not.toMatch(
      /blueSelect:\s*\/Blue's turn - Select a rod\/\.test\(status\)/
    );
  });

  it('keeps the pure illicit-pass helper in scripts/lib', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/export function isBlueSelectStatus/);
    expect(libSrc).toMatch(/export function isIllicitPassSkip/);
    expect(libSrc).toMatch(/Blue's turn - Select a rod/);
  });
});
