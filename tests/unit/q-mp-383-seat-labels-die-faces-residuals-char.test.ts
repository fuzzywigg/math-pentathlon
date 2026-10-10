/**
 * q-mp-383 — Characterize `seat-labels` + `die-faces` residuals (tests-only).
 *
 * Pins CURRENT behavior on tip post830 for edge / empty / unknown-seat paths
 * and die-face out-of-band inputs. Structural asserts only — no new copy pins
 * on Blue/Red/You/AI/Computer (see docs/dev/check-copy-pins.md).
 *
 * Existing coverage (left alone; do not edit):
 *   tests/unit/mutation-ui2-seat-labels.test.ts
 *   tests/unit/mutation-ui2-die-faces.test.ts
 *
 * Parallel note: q-mp-373 (mutation wave 12) may also host die-faces; this
 * file is characterization-only under its own path.
 *
 * Documented quirks (NOT fixed — pin only):
 *   - Forged SeatId values that are not exactly `'player1'` collapse to the
 *     player2 label branch (strict `=== 'player1'` checks).
 *   - Forged GameModeLabel values that are not exactly `'human-vs-ai'` collapse
 *     to the human-vs-human branch.
 *   - getDieFaceEmoji falls back to `value.toString()` (incl. NaN / ±Infinity /
 *     non-integer floats); getDieFaceEmojiOrQuestion falls back to `'?'`.
 *   - Index 0 on getDieFaceEmoji is intentional `"0"` (falsy '' || toString).
 */
import { describe, expect, it } from 'vitest';

import {
  formatModeSeatLabel,
  formatModeSeatLabelComputer,
  getOpponentSeat,
  getPlayerName,
  type GameModeLabel,
  type SeatId,
} from '../../src/ui/seat-labels';
import {
  getDieFaceEmoji,
  getDieFaceEmojiOrQuestion,
} from '../../src/ui/die-faces';

const CANONICAL_SEATS: SeatId[] = ['player1', 'player2'];
const MODES: GameModeLabel[] = ['human-vs-human', 'human-vs-ai'];

/** Forged seats — not in the SeatId union; exercises strict === 'player1'. */
const FORGED_SEATS = ['player3', '', 'Player1', 'PLAYER1', 'player 1'] as SeatId[];

/** Forged modes — not in GameModeLabel; exercises strict === 'human-vs-ai'. */
const FORGED_MODES = [
  'human-vs-AI',
  'Human-vs-ai',
  'ai',
  '',
  'human-vs-human ',
] as GameModeLabel[];

// =============================================================================
// 1. seat-labels — unknown / empty seat residuals
// =============================================================================

describe('q-mp-383 seat-labels — unknown / empty seat residuals', () => {
  it('forged SeatId values collapse to the player2 branch (all helpers)', () => {
    for (const forged of FORGED_SEATS) {
      expect(getPlayerName(forged, false)).toBe(getPlayerName('player2', false));
      expect(getPlayerName(forged, true)).toBe(getPlayerName('player2', true));
      for (const mode of MODES) {
        expect(formatModeSeatLabel(forged, mode)).toBe(
          formatModeSeatLabel('player2', mode)
        );
        expect(formatModeSeatLabelComputer(forged, mode)).toBe(
          formatModeSeatLabelComputer('player2', mode)
        );
      }
      // Never equal to the canonical player1 HvH / HvA labels.
      expect(getPlayerName(forged, false)).not.toBe(
        getPlayerName('player1', false)
      );
      expect(getPlayerName(forged, true)).not.toBe(
        getPlayerName('player1', true)
      );
    }
  });

  it('empty-string seat is treated as non-player1 (same as other forgeries)', () => {
    const empty = '' as SeatId;
    expect(getPlayerName(empty)).toBe(getPlayerName('player2'));
    expect(formatModeSeatLabel(empty, 'human-vs-ai')).toBe(
      formatModeSeatLabel('player2', 'human-vs-ai')
    );
  });

  it('every seat×mode label is a non-empty string (structural; no copy pins)', () => {
    for (const seat of [...CANONICAL_SEATS, ...FORGED_SEATS]) {
      for (const vsAI of [false, true]) {
        const name = getPlayerName(seat, vsAI);
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      }
      for (const mode of MODES) {
        const a = formatModeSeatLabel(seat, mode);
        const b = formatModeSeatLabelComputer(seat, mode);
        expect(typeof a).toBe('string');
        expect(typeof b).toBe('string');
        expect(a.length).toBeGreaterThan(0);
        expect(b.length).toBeGreaterThan(0);
      }
    }
  });
});

// =============================================================================
// 2. seat-labels — mode / cross-helper residual matrix
// =============================================================================

describe('q-mp-383 seat-labels — mode + cross-helper residuals', () => {
  it('forged GameModeLabel values collapse to human-vs-human branches', () => {
    for (const forged of FORGED_MODES) {
      for (const seat of CANONICAL_SEATS) {
        expect(formatModeSeatLabel(seat, forged)).toBe(
          formatModeSeatLabel(seat, 'human-vs-human')
        );
        expect(formatModeSeatLabelComputer(seat, forged)).toBe(
          formatModeSeatLabelComputer(seat, 'human-vs-human')
        );
        expect(formatModeSeatLabel(seat, forged)).not.toBe(
          formatModeSeatLabel(seat, 'human-vs-ai')
        );
      }
    }
  });

  it('getPlayerName vsAI=true aligns with Computer helper on both seats', () => {
    // mutation-ui2 only ties p1→formatModeSeatLabel and p2→Computer; close the
    // residual that getPlayerName uses the Computer naming for both seats.
    expect(getPlayerName('player1', true)).toBe(
      formatModeSeatLabelComputer('player1', 'human-vs-ai')
    );
    expect(getPlayerName('player2', true)).toBe(
      formatModeSeatLabelComputer('player2', 'human-vs-ai')
    );
    // And therefore diverges from the AI-named helper on player2 only.
    expect(getPlayerName('player2', true)).not.toBe(
      formatModeSeatLabel('player2', 'human-vs-ai')
    );
    expect(getPlayerName('player1', true)).toBe(
      formatModeSeatLabel('player1', 'human-vs-ai')
    );
  });

  it('HvH: all three helpers agree for both canonical seats', () => {
    for (const seat of CANONICAL_SEATS) {
      const viaFlag = getPlayerName(seat, false);
      const viaMode = formatModeSeatLabel(seat, 'human-vs-human');
      const viaComputer = formatModeSeatLabelComputer(seat, 'human-vs-human');
      expect(viaFlag).toBe(viaMode);
      expect(viaMode).toBe(viaComputer);
    }
  });

  it('default vsAI omitted equals explicit false for forged seats too', () => {
    for (const forged of FORGED_SEATS) {
      expect(getPlayerName(forged)).toBe(getPlayerName(forged, false));
      expect(getPlayerName(forged)).not.toBe(getPlayerName(forged, true));
    }
  });

  it('re-exported getOpponentSeat stays a pure flip on canonical seats', () => {
    expect(getOpponentSeat('player1')).toBe('player2');
    expect(getOpponentSeat('player2')).toBe('player1');
    expect(getOpponentSeat(getOpponentSeat('player1'))).toBe('player1');
  });
});

// =============================================================================
// 3. die-faces — out-of-band / float / special-number residuals
// =============================================================================

describe('q-mp-383 die-faces — out-of-band residuals', () => {
  it('integer 1..6: both helpers return the same non-empty glyph', () => {
    for (let v = 1; v <= 6; v += 1) {
      const a = getDieFaceEmoji(v);
      const b = getDieFaceEmojiOrQuestion(v);
      expect(a).toBe(b);
      expect(typeof a).toBe('string');
      expect(a.length).toBeGreaterThan(0);
    }
  });

  it('non-integer floats fall back (string vs "?") — not face glyphs', () => {
    for (const v of [1.5, 2.9, 3.1, 5.999]) {
      expect(getDieFaceEmoji(v)).toBe(String(v));
      expect(getDieFaceEmojiOrQuestion(v)).toBe('?');
      // Must not silently coerce to a neighboring integer face.
      expect(getDieFaceEmoji(v)).not.toBe(getDieFaceEmoji(Math.floor(v)));
      expect(getDieFaceEmoji(v)).not.toBe(getDieFaceEmoji(Math.ceil(v)));
    }
  });

  it('NaN and ±Infinity: emoji uses toString; question uses "?"', () => {
    expect(getDieFaceEmoji(Number.NaN)).toBe('NaN');
    expect(getDieFaceEmojiOrQuestion(Number.NaN)).toBe('?');
    expect(getDieFaceEmoji(Number.POSITIVE_INFINITY)).toBe('Infinity');
    expect(getDieFaceEmojiOrQuestion(Number.POSITIVE_INFINITY)).toBe('?');
    expect(getDieFaceEmoji(Number.NEGATIVE_INFINITY)).toBe('-Infinity');
    expect(getDieFaceEmojiOrQuestion(Number.NEGATIVE_INFINITY)).toBe('?');
  });

  it('negative integers beyond -1 stay on the string / "?" contract', () => {
    for (const v of [-2, -6, -100]) {
      expect(getDieFaceEmoji(v)).toBe(String(v));
      expect(getDieFaceEmojiOrQuestion(v)).toBe('?');
    }
  });

  it('helpers disagree on every out-of-range integer (string vs "?")', () => {
    for (const v of [0, 7, 8, 99, -1]) {
      const emoji = getDieFaceEmoji(v);
      const q = getDieFaceEmojiOrQuestion(v);
      expect(emoji).not.toBe(q);
      expect(q).toBe('?');
      expect(emoji).toBe(String(v));
    }
  });

  it('question helper never returns empty; emoji never returns empty for numbers', () => {
    const samples = [
      0, 1, 2, 3, 4, 5, 6, 7, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY,
    ];
    for (const v of samples) {
      expect(getDieFaceEmoji(v).length).toBeGreaterThan(0);
      expect(getDieFaceEmojiOrQuestion(v).length).toBeGreaterThan(0);
    }
  });
});
