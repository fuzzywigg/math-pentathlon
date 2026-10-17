/**
 * q-mp-1466: par-55-deep-playtest illicitPass must increment when the
 * illicit Blue-pass condition is observed. Pure helper + harness wiring
 * (unit-shared; no Playwright).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  COMPUTER_STATUS_RE,
  countIllicitBluePasses,
  humanPlacedAction,
  humanPassedAction,
  isIllicitBluePassSample,
} from '../../scripts/lib/par-55-illicit-pass.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/par-55-deep-playtest.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/par-55-illicit-pass.mjs');

describe('isIllicitBluePassSample (q-mp-1466)', () => {
  it('flags history jumped with Blue while human did not place', () => {
    expect(
      isIllicitBluePassSample({
        histBefore: 2,
        histAfter: 3,
        blueCountBefore: 1,
        blueCountAfter: 2,
        humanAction: 'no-move',
        statusAfter: 'Computer is thinking…',
      })
    ).toBe(true);

    // Legitimate human place that adds a Blue history entry.
    expect(
      isIllicitBluePassSample({
        histBefore: 2,
        histAfter: 3,
        blueCountBefore: 1,
        blueCountAfter: 2,
        humanAction: 'place',
        statusAfter: 'Computer is thinking…',
      })
    ).toBe(false);
  });

  it('flags seat-steal passTurn: flat history + computer after non-pass', () => {
    expect(
      isIllicitBluePassSample({
        histBefore: 4,
        histAfter: 4,
        blueCountBefore: 2,
        blueCountAfter: 2,
        humanAction: 'no-valid',
        statusAfter: 'Computer is thinking…',
      })
    ).toBe(true);

    // Legitimate Pass Turn: history flat, then computer — not illicit.
    expect(
      isIllicitBluePassSample({
        histBefore: 4,
        histAfter: 4,
        blueCountBefore: 2,
        blueCountAfter: 2,
        humanAction: 'pass',
        statusAfter: 'Computer is thinking…',
      })
    ).toBe(false);

    // Place failed but Blue still owns the seat — not illicit.
    expect(
      isIllicitBluePassSample({
        histBefore: 4,
        histAfter: 4,
        blueCountBefore: 2,
        blueCountAfter: 2,
        humanAction: 'no-move',
        statusAfter: "Blue's turn - Tap a block from your hand",
      })
    ).toBe(false);
  });

  it('counts across a stubbed history/status sequence', () => {
    // End-only / never-increment bug: always 0. Stubbed sequence fires twice.
    expect(
      countIllicitBluePasses([
        {
          histBefore: 0,
          histAfter: 1,
          blueCountBefore: 0,
          blueCountAfter: 1,
          humanAction: 'no-move',
          statusAfter: 'Computer is thinking…',
        },
        {
          histBefore: 1,
          histAfter: 2,
          blueCountBefore: 1,
          blueCountAfter: 1,
          humanAction: 'place',
          statusAfter: "Blue's turn - Tap a green base to place",
        },
        {
          histBefore: 3,
          histAfter: 3,
          blueCountBefore: 2,
          blueCountAfter: 2,
          humanAction: 'no-valid',
          statusAfter: '🤖 Computer is thinking…',
        },
      ])
    ).toBe(2);

    expect(
      countIllicitBluePasses([
        {
          histBefore: 0,
          histAfter: 1,
          blueCountBefore: 0,
          blueCountAfter: 1,
          humanAction: 'place',
          statusAfter: 'Computer is thinking…',
        },
        {
          histBefore: 1,
          histAfter: 1,
          blueCountBefore: 1,
          blueCountAfter: 1,
          humanAction: 'pass',
          statusAfter: 'Computer is thinking…',
        },
      ])
    ).toBe(0);
  });

  it('classifies place / pass helpers and computer status', () => {
    expect(humanPlacedAction('place')).toBe(true);
    expect(humanPlacedAction('place-only')).toBe(true);
    expect(humanPlacedAction('pass')).toBe(false);
    expect(humanPassedAction('pass')).toBe(true);
    expect(humanPassedAction('place')).toBe(false);
    expect(COMPUTER_STATUS_RE.test('Computer is thinking…')).toBe(true);
    expect(COMPUTER_STATUS_RE.test("Blue's turn")).toBe(false);
  });
});

describe('par-55-deep-playtest harness wiring (q-mp-1466)', () => {
  it('imports isIllicitBluePassSample and increments illicitPass', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/par-55-illicit-pass\.mjs['"]/);
    expect(src).toMatch(/isIllicitBluePassSample/);
    expect(src).toMatch(/illicitPass\+\+/);
    expect(src).toMatch(/illicitPasses:/);
    // Must not leave the detection comment as a status-only stub.
    expect(src).toMatch(
      /Detect illicit AI pass of Blue[\s\S]*?illicitPass\+\+/
    );
  });

  it('keeps the pure sample helper in scripts/lib', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/export function isIllicitBluePassSample/);
    expect(libSrc).toMatch(/export function countIllicitBluePasses/);
    expect(libSrc).toMatch(/history jumped with a Blue/);
  });
});
