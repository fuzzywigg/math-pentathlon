/**
 * q-mp-1475: star-track deep-playtest confusing_turn_copy must not flag
 * normal drawChains / selectChain statuses. Hermetic stubs — no Playwright.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  STAR_TRACK_NORMAL_TURN_COPY_RE,
  STAR_TRACK_TURN_LOOKING_RE,
  confusingTurnCopyFinding,
  isConfusingTurnCopy,
} from '../playtest/star-track-confusing-turn-copy.mjs';

const HARNESS = resolve(
  process.cwd(),
  'tests/playtest/star-track-deep-playtest.mjs'
);
const LIB = resolve(
  process.cwd(),
  'tests/playtest/star-track-confusing-turn-copy.mjs'
);

/** Stubbed status snaps shaped like the harness page.evaluate return. */
type Snap = { status: string; thinking: boolean };

describe('isConfusingTurnCopy (q-mp-1475)', () => {
  it('does not flag normal drawChains / selectChain statuses', () => {
    const normalSnaps: Snap[] = [
      {
        status: "Blue's turn - Draw chains from the bucket",
        thinking: false,
      },
      {
        status: "Red's turn - Draw chains from the bucket",
        thinking: false,
      },
      { status: 'Blue: Choose a chain to move', thinking: false },
      { status: 'Red: Choose a chain to move', thinking: false },
    ];

    for (const snap of normalSnaps) {
      expect(isConfusingTurnCopy(snap.status, snap.thinking)).toBe(false);
      expect(confusingTurnCopyFinding(snap.status, snap.thinking)).toBeNull();
      // Historical regex still matches — the bug was treating match as finding.
      expect(STAR_TRACK_TURN_LOOKING_RE.test(snap.status)).toBe(true);
      expect(STAR_TRACK_NORMAL_TURN_COPY_RE.test(snap.status.trim())).toBe(
        true
      );
    }

    const findings = normalSnaps
      .map((s) => confusingTurnCopyFinding(s.status, s.thinking))
      .filter(Boolean);
    expect(findings).toHaveLength(0);
  });

  it('skips AI-thinking seats even when status looks like a human turn', () => {
    expect(
      isConfusingTurnCopy("Blue's turn - Draw chains from the bucket", true)
    ).toBe(false);
    expect(
      isConfusingTurnCopy("Blue's turn - something unexpected", true)
    ).toBe(false);
  });

  it('still flags unexpected / grammar-broken turn-looking copy', () => {
    const weird: Snap[] = [
      { status: "Blue's turn - something unexpected", thinking: false },
      { status: "Blue's turn Draw chains from the bucket", thinking: false },
      { status: 'Blue: Draw chains from the bucket', thinking: false },
      { status: "Blue's turn - Choose a chain to move", thinking: false },
      { status: 'Red: pick a chain', thinking: false },
    ];

    for (const snap of weird) {
      expect(isConfusingTurnCopy(snap.status, snap.thinking)).toBe(true);
      expect(confusingTurnCopyFinding(snap.status, snap.thinking)).toEqual({
        type: 'confusing_turn_copy',
        text: snap.status.trim(),
      });
    }
  });

  it('ignores win/draw banners and empty / non-turn statuses', () => {
    for (const status of [
      'Blue wins!',
      "It's a draw! All chains exhausted.",
      'You Win!',
      'AI Wins!',
      '',
      '🤖 AI is thinking...',
    ]) {
      expect(isConfusingTurnCopy(status, false)).toBe(false);
    }
    expect(isConfusingTurnCopy(null, false)).toBe(false);
    expect(isConfusingTurnCopy(undefined, false)).toBe(false);
  });
});

describe('star-track-deep-playtest harness wiring (q-mp-1475)', () => {
  it('imports confusingTurnCopyFinding and does not push findings on bare turn regex', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/star-track-confusing-turn-copy\.mjs['"]/);
    expect(src).toMatch(/confusingTurnCopyFinding\(/);
    expect(src).toMatch(/confusing_turn_copy/);
    expect(src).toMatch(/Blue's turn/);
    // Inline historical push must be gone (gate lives in the helper).
    expect(src).not.toMatch(
      /findings\.push\(\s*\{\s*type:\s*['"]confusing_turn_copy['"]/
    );
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/STAR_TRACK_NORMAL_TURN_COPY_RE/);
    expect(libSrc).toMatch(/isConfusingTurnCopy/);
  });
});
