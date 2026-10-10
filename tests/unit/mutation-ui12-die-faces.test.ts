/**
 * q-mp-373 mutation audit UI wave 12 — die-faces structural re-pins.
 * Separate from characterization q-mp-383. No player-facing copy asserts;
 * hard-coded glyph / fallback contracts so || / arithmetic mutants stay dead.
 */
import { describe, expect, it } from 'vitest';
import {
  getDieFaceEmoji,
  getDieFaceEmojiOrQuestion,
} from '../../src/ui/die-faces';

const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const;

describe('mutation-ui12 die-faces', () => {
  it('maps each 1..6 index to the exact 1-indexed face glyph', () => {
    for (let v = 1; v <= 6; v++) {
      expect(getDieFaceEmoji(v)).toBe(FACES[v - 1]);
    }
  });

  it('index 0 is falsy empty slot so || yields decimal "0"', () => {
    // Preserved contract: FACES_1_INDEXED[0] === '' → || value.toString()
    expect(getDieFaceEmoji(0)).toBe('0');
    expect(getDieFaceEmoji(0)).not.toBe('');
  });

  it('out-of-range contig helper stringifies (kills L13 ||→&&)', () => {
    expect(getDieFaceEmoji(7)).toBe('7');
    expect(getDieFaceEmoji(-1)).toBe('-1');
    expect(getDieFaceEmoji(99)).toBe('99');
  });

  it('remainder helper is value-1 indexed (kills L21 -→+ and 1→0/2)', () => {
    for (let v = 1; v <= 6; v++) {
      expect(getDieFaceEmojiOrQuestion(v)).toBe(FACES[v - 1]);
      expect(getDieFaceEmojiOrQuestion(v)).toBe(getDieFaceEmoji(v));
    }
    // Adjacent indices must not collapse under ±1 on the subtractand.
    expect(getDieFaceEmojiOrQuestion(3)).toBe(FACES[2]);
    expect(getDieFaceEmojiOrQuestion(3)).not.toBe(FACES[1]);
    expect(getDieFaceEmojiOrQuestion(3)).not.toBe(FACES[3]);
  });

  it('remainder unknown falls back to "?" (kills L21 ||→&&)', () => {
    expect(getDieFaceEmojiOrQuestion(0)).toBe('?');
    expect(getDieFaceEmojiOrQuestion(7)).toBe('?');
    expect(getDieFaceEmojiOrQuestion(-2)).toBe('?');
  });
});
